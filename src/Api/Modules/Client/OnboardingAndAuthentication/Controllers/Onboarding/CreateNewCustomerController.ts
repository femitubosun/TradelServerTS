import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  CUSTOMER_ONBOARDING_SUCCESS,
  CUSTOMER_ROLE_NAME,
  EMAIL_IN_USE,
  ERROR,
  NULL_OBJECT,
  ROLE_DOES_NOT_EXIST,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import UsersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
import { InventoryInternalApi } from "Api/Modules/Client/Inventory/InventoryInternalApi";
import SettingsUserRoleService from "Api/Modules/Client/OnboardingAndAuthentication/Services/SettingsUserRoleService";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { generateStringOfLength } from "Utils/generateStringOfLength";
import { businessConfig } from "Config/businessConfig";
import { DateTime } from "luxon";
import UserTokensService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UserTokensService";
import { UserTokenTypesEnum } from "Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/UserTokens";
import Event from "Lib/Events";
import { eventTypes } from "Lib/Events/Listeners/TypeChecking/eventTypes";
import { JwtHelper } from "Api/Modules/Common/Helpers/JwtHelper";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";

const dbContext = container.resolve(DbContext);

class CreateNewCustomerController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
    try {
      const {
        first_name: firstName,
        last_name: lastName,
        password,
        phone_number: phoneNumber,
        email,
      } = request.body;

      const [foundUser, role] = await Promise.all([
        UsersService.getUserByEmail(email),
        SettingsUserRoleService.findSettingsUserRoleByName(CUSTOMER_ROLE_NAME),
      ]);

      if (foundUser) {
        return response.status(HttpStatusCodeEnum.UNPROCESSABLE_ENTITY).json({
          status_code: HttpStatusCodeEnum.UNPROCESSABLE_ENTITY,
          status: ERROR,
          message: EMAIL_IN_USE,
        });
      }

      if (role === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
          status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
          status: ERROR,
          message: ROLE_DOES_NOT_EXIST,
        });
      }

      const user = await UsersService.createUserRecord({
        firstName,
        lastName,
        email,
        password,
        roleId: role.id,
        queryRunner,
      });

      const customer = await ProfileInternalApi.createCustomerRecord({
        userId: user.id,
        phoneNumber,
        queryRunner,
      });

      await InventoryInternalApi.createCartRecord({
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

      return response.status(HttpStatusCodeEnum.CREATED).json({
        status: SUCCESS,
        status_code: HttpStatusCodeEnum.CREATED,
        message: CUSTOMER_ONBOARDING_SUCCESS,
        results,
      });
    } catch (CreateNewCustomerControllerError) {
      console.log(
        "🚀 ~ CreateNewCustomerController.handle CreateNewCustomerControllerError ->",
        CreateNewCustomerControllerError
      );

      await queryRunner.rollbackTransaction();

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new CreateNewCustomerController();
