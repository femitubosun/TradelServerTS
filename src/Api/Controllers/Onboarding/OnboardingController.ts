import { Request, Response } from "express";
import { keysSnakeCaseToCamelCase } from "Utils/keysSnakeCaseToCamelCase";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  CreateMerchant,
  MerchantOnboardingUseCaseArgs,
} from "Logic/UseCases/Onboarding";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import {
  CUSTOMER_ONBOARDING_SUCCESS,
  CUSTOMER_ROLE_NAME,
  ERROR,
  MERCHANT_ONBOARDING_SUCCESS,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import UsersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
import SettingsUserRoleService from "Api/Modules/Client/OnboardingAndAuthentication/Services/SettingsUserRoleService";
import CustomersService from "Logic/Services/CustomersService";
import CartService from "Logic/Services/CartService";
import { generateStringOfLength } from "Utils/generateStringOfLength";
import { businessConfig } from "Config/businessConfig";
import UserTokensService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UserTokensService";
import { UserTokenTypesEnum } from "TypeChecking/../../Modules/Client/OnboardingAndAuthentication/TypeChecking/UserTokens";
import { DateTime } from "luxon";
import Event from "Lib/Events";
import { eventTypes } from "Lib/Events/Listeners/TypeChecking/eventTypes";
import { JwtHelper } from "Api/Modules/Common/Helpers/JwtHelper";

const dbContext = container.resolve(DbContext);

class OnboardingController {
  private statusCode: HttpStatusCodeEnum;

  public async onboardCustomer(req: Request, res: Response) {
    try {
      this.statusCode = HttpStatusCodeEnum.CREATED;
      const {
        first_name: firstName,
        last_name: lastName,
        password,
        phone_number: phoneNumber,
        email,
      } = req.body;

      const [foundUser, role] = await Promise.all([
        UsersService.getUserByEmail(email),
        SettingsUserRoleService.findSettingsUserRoleByName(CUSTOMER_ROLE_NAME),
      ]);

      if (foundUser) {
        return res.status(HttpStatusCodeEnum.UNPROCESSABLE_ENTITY).json({
          status_code: HttpStatusCodeEnum.UNPROCESSABLE_ENTITY,
          status: "Error",
          message: "Email Already exists",
        });
      }

      if (role === NULL_OBJECT) {
        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
          status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
          status: "Error",
          message: "Roles does not exists",
        });
      }

      const queryRunner = await dbContext.getTransactionalQueryRunner();

      await queryRunner.startTransaction();

      try {
        const user = await UsersService.createUserRecord({
          firstName,
          lastName,
          email,
          password,
          roleId: role.id,
          queryRunner,
        });

        const customer = await CustomersService.createCustomerRecord({
          userId: user.id,
          phoneNumber,
          queryRunner,
        });

        await CartService.createCartRecord({
          customerId: customer.id,
          queryRunner,
        });

        const token = generateStringOfLength(businessConfig.emailTokenLength);
        const expiresOn = DateTime.now().plus({
          minute: businessConfig.emailTokenExpiresInMinutes,
        });

        const otpToken = await UserTokensService.createUserTokenRecord({
          userId: user.id,
          tokenType: UserTokenTypesEnum.EMAIL,
          expiresOn,
          queryRunner,
          token,
        });

        await queryRunner.commitTransaction();

        Event.emit(eventTypes.user.signUp, {
          userEmail: user.email,
          activationToken: otpToken.token,
        });

        const accessToken = JwtHelper.signUser(user);

        const results = {
          user: {
            identifier: user.identifier,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
          },
          access_token: accessToken,
        };

        return res.status(this.statusCode).json({
          status: SUCCESS,
          status_code: this.statusCode,
          message: CUSTOMER_ONBOARDING_SUCCESS,
          results,
        });
      } catch (onboardCustomerError) {
        await queryRunner.rollbackTransaction();
        console.log(
          "🚀 ~ OnboardingController.onboardCustomer onboardCustomerError ->",
          onboardCustomerError
        );

        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
          status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
          status: ERROR,
          message: SOMETHING_WENT_WRONG,
        });
      }
    } catch (onboardCustomerError) {
      console.log(
        "🚀 ~ OnboardingController.onboardCustomer onboardCustomerError ->",
        onboardCustomerError
      );
      return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }

  public async onboardMerchant(req: Request, res: Response) {
    this.statusCode = HttpStatusCodeEnum.CREATED;

    const mutantOnboardMerchantRequest = keysSnakeCaseToCamelCase(req.body);

    const queryRunner = await dbContext.getTransactionalQueryRunner();

    const merchantOnboardingUseCaseArgs = {
      ...mutantOnboardMerchantRequest,
      queryRunner,
    };

    const results = await CreateMerchant.execute(
      merchantOnboardingUseCaseArgs as MerchantOnboardingUseCaseArgs
    );

    return res.status(this.statusCode).json({
      status: SUCCESS,
      status_code: this.statusCode,
      message: MERCHANT_ONBOARDING_SUCCESS,
      results,
    });
  }
}

export default new OnboardingController();
