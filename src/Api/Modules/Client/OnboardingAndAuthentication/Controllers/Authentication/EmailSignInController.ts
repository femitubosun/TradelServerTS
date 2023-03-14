import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  CHECK_EMAIL_AND_PASSWORD,
  ERROR,
  INVALID_CREDENTIALS,
  NULL_OBJECT,
  SIGN_IN_SUCCESSFUL,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import UsersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
import { BadRequestError } from "Api/Modules/Common/Exceptions/BadRequestError";
import { PasswordEncryptionHelper } from "Api/Modules/Common/Helpers/PasswordEncryptionHelper";
import { JwtHelper } from "Api/Modules/Common/Helpers/JwtHelper";
import Event from "Lib/Events";
import { eventTypes } from "Lib/Events/Listeners/TypeChecking/eventTypes";

class EmailSignInController {
  public async handle(request: Request, response: Response) {
    try {
      const { email, password } = request.body;

      const user = await UsersService.getUserByEmail(email);

      if (user == NULL_OBJECT) {
        console.log("No user record");
        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: INVALID_CREDENTIALS,
        });
      }

      const isMatch = await PasswordEncryptionHelper.verifyPassword(
        password,
        user.password
      );

      const IS_NOT_MATCH = false;

      if (isMatch === IS_NOT_MATCH) {
        console.log("Password mismatch");

        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: INVALID_CREDENTIALS,
        });
      }

      const accessToken = JwtHelper.signUser(user);

      Event.emit(eventTypes.user.signIn, user.id);

      if (user.isFirstTimeLogin) {
        await UsersService.updateUserRecord({
          identifier: user.id,
          identifierType: "id",
          updateUserRecordPayload: {
            isFirstTimeLogin: false,
          },
        });
      }

      return response.status(HttpStatusCodeEnum.OK).json({
        status: SUCCESS,
        status_code: HttpStatusCodeEnum.OK,
        message: SIGN_IN_SUCCESSFUL,
        results: {
          user: {
            identifier: user.identifier,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
          },
          access_token: accessToken,
        },
      });
    } catch (EmailSignInControllerError) {
      console.log(
        "🚀 ~ EmailSignInController.handle EmailSignInControllerError ->",
        EmailSignInControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new EmailSignInController();
