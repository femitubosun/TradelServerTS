import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  CUSTOMER_ONBOARDING_SUCCESS,
  EMAIL_IN_USE,
  ERROR,
  MERCHANT_ROLE_NAME,
  NULL_OBJECT,
  ROLE_DOES_NOT_EXIST,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Helpers/Messages/SystemMessages";
import UsersService from "Logic/Services/UsersService";
import SettingsUserRoleService from "Logic/Services/SettingsUserRoleService";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import MerchantService from "Logic/Services/MerchantService";
import { generateStringOfLength } from "Utils/generateStringOfLength";
import { businessConfig } from "Config/businessConfig";
import UserTokensService from "Logic/Services/UserTokensService";
import { UserTokenTypesEnum } from "TypeChecking/UserTokens";
import Event from "Lib/Events";
import { eventTypes } from "Lib/Events/Listeners/TypeChecking/eventTypes";
import { JwtHelper } from "Helpers/JwtHelper";

const dbContext = container.resolve(DbContext);

class CreateNewMerchantController {
  public async handle(request: Request, response: Response) {
    try {
      const {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        phone_number: phoneNumber,
        store_name: storeName,
      } = request.body;

      const [foundUser, role] = await Promise.all([
        UsersService.getUserByEmail(email),
        SettingsUserRoleService.findSettingsUserRoleByName(MERCHANT_ROLE_NAME),
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

      const queryRunner = await dbContext.getTransactionalQueryRunner();

      await queryRunner.startTransaction();

      try {
        const user = await UsersService.createUserRecord({
          firstName,
          lastName,
          email,
          roleId: role.id,
          queryRunner,
          password,
        });

        await MerchantService.createMerchantRecord({
          userId: user.id,
          phoneNumber,
          storeName,
          queryRunner,
        });

        const token = generateStringOfLength(businessConfig.emailTokenLength);

        const otpToken = await UserTokensService.createUserTokenRecord({
          userId: user.id,
          queryRunner,
          expiresOn: UserTokensService.getEmailTokenExpiresOn(),
          tokenType: UserTokenTypesEnum.EMAIL,
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
      } catch (CreateNewMerchantControllerError) {
        await queryRunner.rollbackTransaction();

        console.log(
          "🚀 ~ CreateNewMerchantController.handle CreateNewMerchantControllerError ->",
          CreateNewMerchantControllerError
        );

        return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
          status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
          status: ERROR,
          message: SOMETHING_WENT_WRONG,
        });
      }
    } catch (CreateNewMerchantControllerError) {
      console.log(
        "🚀 ~ CreateNewMerchantController.handle CreateNewMerchantControllerError ->",
        CreateNewMerchantControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new CreateNewMerchantController();
