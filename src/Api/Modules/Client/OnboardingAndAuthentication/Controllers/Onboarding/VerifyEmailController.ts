import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  EMAIL_VERIFICATION_SUCCESS,
  ERROR,
  INVALID_TOKEN,
  INVALID_TOKEN_TYPE,
  NO_TOKEN_RECORD,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  TOKEN_EXPIRED,
  UNAUTHORIZED_OPERATION,
  USER_DOES_NOT_EXIST,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { BadRequestError } from "Api/Modules/Common/Exceptions/BadRequestError";
import UserTokensService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UserTokensService";
import { UserTokenTypesEnum } from "Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/UserTokens";
import UsersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
import { UnauthorizedError } from "Api/Modules/Common/Exceptions/UnauthorizedError";
import { DateTime } from "luxon";
import usersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
import userTokensService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UserTokensService";

class VerifyEmailController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;
      const { otp_token: emailVerifyToken } = request.body;

      if (!emailVerifyToken) {
        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: INVALID_TOKEN,
        });
      }

      const dbEmailVerificationToken =
        await UserTokensService.getUserTokenByToken(emailVerifyToken);

      if (dbEmailVerificationToken === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: INVALID_TOKEN,
        });
      }

      if (dbEmailVerificationToken.tokenType != UserTokenTypesEnum.EMAIL) {
        await UserTokensService.deactivateUserToken(
          dbEmailVerificationToken.id
        );

        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: INVALID_TOKEN,
        });
      }

      const tokenOwner = await UsersService.getUserById(
        dbEmailVerificationToken.userId
      );

      if (tokenOwner == NULL_OBJECT)
        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: INVALID_TOKEN,
        });

      if (tokenOwner.hasVerifiedEmail) {
        return response.status(HttpStatusCodeEnum.OK).json({
          status_code: HttpStatusCodeEnum.OK,
          status: SUCCESS,
          message: EMAIL_VERIFICATION_SUCCESS,
        });
      }
      if (tokenOwner.id != user.id) {
        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: INVALID_TOKEN,
        });
      }

      if (
        dbEmailVerificationToken.expired ||
        DateTime.now() > dbEmailVerificationToken.expiresOn
      ) {
        await UserTokensService.deactivateUserToken(
          dbEmailVerificationToken.id
        );
        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: TOKEN_EXPIRED,
        });
      }

      await usersService.activateUserEmail(user.id);

      await userTokensService.deactivateUserToken(dbEmailVerificationToken.id);

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: EMAIL_VERIFICATION_SUCCESS,
      });
    } catch (VerifyEmailControllerError) {
      console.log(
        "🚀 ~ VerifyEmailController.handle VerifyEmailControllerError ->",
        VerifyEmailControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new VerifyEmailController();
