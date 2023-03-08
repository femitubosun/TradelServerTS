import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  EMAIL_VERIFICATION_TOKEN_REQUEST_SUCCESS,
  ERROR,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import UserTokensService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UserTokensService";
import { UserTokenTypesEnum } from "Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/UserTokens";
import { generateStringOfLength } from "Utils/generateStringOfLength";
import { businessConfig } from "Config/businessConfig";
import { EmailService } from "Logic/Services/Email/EmailService";

const dbContext = container.resolve(DbContext);

class RequestNewEmailVerificationTokenController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;
      const queryRunner = await dbContext.getTransactionalQueryRunner();

      await queryRunner.startTransaction();
      try {
        const userTokens =
          await UserTokensService.listUserTokenForUserByTokenType({
            userId: user.id,
            tokenType: UserTokenTypesEnum.EMAIL,
          });

        if (userTokens) {
          for (const token of userTokens) {
            await UserTokensService.deactivateUserToken(token.id);
          }
        }

        const token = generateStringOfLength(businessConfig.emailTokenLength);

        const otpToken = await UserTokensService.createEmailActivationToken({
          userId: user.id,
          token,
          queryRunner,
        });

        await queryRunner.commitTransaction();

        await EmailService.sendAccountActivationEmail({
          userEmail: user.email,
          activationToken: otpToken.token,
        });

        return response.status(HttpStatusCodeEnum.OK).json({
          status_code: HttpStatusCodeEnum.OK,
          status: SUCCESS,
          message: EMAIL_VERIFICATION_TOKEN_REQUEST_SUCCESS,
        });
      } catch (RequestNewEmailVerificationTokenControllerError) {
        await queryRunner.rollbackTransaction();
        console.log(
          "🚀 ~ RequestNewEmailVerificationTokenController.handle RequestNewEmailVerificationTokenControllerError ->",
          RequestNewEmailVerificationTokenControllerError
        );

        return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
          status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
          status: ERROR,
          message: SOMETHING_WENT_WRONG,
        });
      }
    } catch (RequestNewEmailVerificationTokenControllerError) {
      console.log(
        "🚀 ~ RequestNewEmailVerificationTokenController.handle RequestNewEmailVerificationTokenControllerError ->",
        RequestNewEmailVerificationTokenControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new RequestNewEmailVerificationTokenController();
