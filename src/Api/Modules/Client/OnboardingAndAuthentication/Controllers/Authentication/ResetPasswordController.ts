import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NULL_OBJECT,
  PASSWORD_RESET_SUCCESSFULLY,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import UserTokensService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UserTokensService";
import UsersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
import { PasswordEncryptionHelper } from "Api/Modules/Common/Helpers/PasswordEncryptionHelper";

class ResetPasswordController {
  public async handle(request: Request, response: Response) {
    try {
      const { passwordResetToken } = request.params;

      const { password } = request.body;

      const dbPasswordresetToken = await UserTokensService.getUserTokenByToken(
        passwordResetToken
      );

      if (dbPasswordresetToken === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: "Invalid Password Reset Token",
        });
      }

      const user = await UsersService.getUserById(dbPasswordresetToken.userId);

      if (user == NULL_OBJECT) {
        await UserTokensService.deactivateUserToken(dbPasswordresetToken.id);

        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: "Invalid Password Reset Token",
        });
      }

      try {
        await UsersService.updateUserRecord({
          identifierType: "id",
          identifier: user.id,
          updateUserRecordPayload: {
            password: PasswordEncryptionHelper.hashPassword(password),
          },
        });

        await UserTokensService.deactivateUserToken(dbPasswordresetToken.id);

        return response.status(HttpStatusCodeEnum.OK).json({
          status_code: HttpStatusCodeEnum.OK,
          status: SUCCESS,
          message: PASSWORD_RESET_SUCCESSFULLY,
        });
      } catch (ResetPasswordControllerError) {
        console.log(
          "🚀 ~ ResetPasswordController.handle ResetPasswordControllerError ->",
          ResetPasswordControllerError
        );
      }
    } catch (ResetPasswordControllerError) {
      console.log(
        "🚀 ~ ResetPasswordController.handle ResetPasswordControllerError ->",
        ResetPasswordControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new ResetPasswordController();
