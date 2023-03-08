import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import { AuthRequest } from "Api/TypeChecking";
import { RequestEmailVerificationToken } from "Logic/UseCases/Auth/RequestEmailVerificationToken";
import {
  CHECK_EMAIL_AND_PASSWORD,
  EMAIL_VERIFICATION_TOKEN_REQUEST_SUCCESS,
  ERROR,
  INVALID_TOKEN,
  NULL_OBJECT,
  PASSWORD_RESET_LINK_GENERATED,
  PASSWORD_RESET_SUCCESSFULLY,
  SIGN_IN_SUCCESSFUL,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  USER_RESOURCE,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { BadRequestError } from "Api/Modules/Common/Exceptions/BadRequestError";
import { ResetPassword } from "Logic/UseCases/Auth/ResetPassword";
import UsersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
import { PasswordEncryptionHelper } from "Api/Modules/Common/Helpers/PasswordEncryptionHelper";
import { JwtHelper } from "Api/Modules/Common/Helpers/JwtHelper";
import Event from "Lib/Events";
import { eventTypes } from "Lib/Events/Listeners/TypeChecking/eventTypes";
import { generateStringOfLength } from "Utils/generateStringOfLength";
import { businessConfig, expressConfig } from "Config/index";
import UserTokensService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UserTokensService";
import { UserTokenTypesEnum } from "TypeChecking/../../Modules/Client/OnboardingAndAuthentication/TypeChecking/UserTokens";
import { SendPasswordResetLinkDtoType } from "Logic/Services/Email/TypeChecking/SendPasswordRestLinkDtoType";
import { EmailService } from "Logic/Services/Email/EmailService";
import { RECORD_NOT_FOUND } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

const dbContext = container.resolve(DbContext);

class AuthController {
  public statusCode: HttpStatusCodeEnum;

  public async requestPasswordResetLink(request: Request, response: Response) {
    let statusCode = HttpStatusCodeEnum.OK;
    const { email } = request.body;

    const queryRunner = await dbContext.getTransactionalQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await UsersService.getUserByEmail(email);

      if (user == NULL_OBJECT) {
        return response.status(statusCode).json({
          status_code: statusCode,
          status: ERROR,
          message: RECORD_NOT_FOUND(USER_RESOURCE),
        });
      }

      const userToken = await UserTokensService.fetchActiveUserTokenRecord({
        userId: user.id,
        tokenType: UserTokenTypesEnum.PASSWORD_RESET,
      });

      if (userToken) {
        await UserTokensService.deactivateUserToken(userToken.id);
      }

      const token = generateStringOfLength(
        businessConfig.passwordResetTokenLength
      );

      const expiresOn = businessConfig.currentDateTime.plus({
        minute: businessConfig.passwordResetTokenExpiresInMinutes,
      });

      const passwordResetToken = await UserTokensService.createUserTokenRecord({
        userId: user.id,
        tokenType: UserTokenTypesEnum.PASSWORD_RESET,
        token,
        queryRunner,
        expiresOn,
      });

      const passwordResetLink = `http://${businessConfig.host}:${expressConfig.port}/Interface/Process/ResetPassword/${passwordResetToken.token}`;

      const sendPasswordResetLinkDto: SendPasswordResetLinkDtoType = {
        userEmail: user.email,
        passwordResetLink: passwordResetLink,
      };

      await EmailService.sendPasswordResetLink(sendPasswordResetLinkDto);

      await queryRunner.commitTransaction();

      return response.status(statusCode).json({
        status_code: statusCode,
        status: SUCCESS,
        message: PASSWORD_RESET_LINK_GENERATED,
      });
    } catch (startPasswordRecoveryError) {
      await queryRunner.rollbackTransaction();
      statusCode = HttpStatusCodeEnum.INTERNAL_SERVER_ERROR;

      response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: statusCode,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }

  public async resetPassword(req: Request, res: Response) {
    this.statusCode = HttpStatusCodeEnum.OK;

    const { passwordResetToken } = req.params;
    const password = req.body.password;

    const queryRunner = await dbContext.getTransactionalQueryRunner();

    if (!passwordResetToken) throw new BadRequestError(INVALID_TOKEN);

    const resetPasswordArgs = {
      passwordResetToken,
      password,
      queryRunner,
    };

    await ResetPassword.execute(resetPasswordArgs);

    res.status(this.statusCode).json({
      status: SUCCESS,
      status_code: this.statusCode,
      message: PASSWORD_RESET_SUCCESSFULLY,
      results: null,
    });
  }
}

export default new AuthController();
