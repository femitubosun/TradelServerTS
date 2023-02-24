import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import { SignInUserWithEmail } from "Logic/UseCases/Auth/SignInUserWithEmail";
import { AuthRequest } from "Api/TypeChecking";
import { VerifyUserEmail } from "Logic/UseCases/Onboarding";
import { RequestEmailVerificationToken } from "Logic/UseCases/Auth/RequestEmailVerificationToken";
import {
  EMAIL_VERIFICATION_SUCCESS,
  EMAIL_VERIFICATION_TOKEN_REQUEST_SUCCESS,
  FAILURE,
  INVALID_TOKEN,
  PASSWORD_RESET_LINK_GENERATED,
  PASSWORD_RESET_SUCCESSFULLY,
  SIGN_IN_SUCCESSFUL,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Helpers/Messages/SystemMessages";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { StartPasswordRecovery } from "Logic/UseCases/Auth/StartPasswordRecovery";
import { BadRequestError } from "Exceptions/BadRequestError";
import { ResetPassword } from "Logic/UseCases/Auth/ResetPassword";
import { StartPasswordRecoveryDtoType } from "Logic/UseCases/Auth/TypeSetting/StartPasswordRecoveryArgs";

const dbContext = container.resolve(DbContext);

class AuthController {
  public statusCode: HttpStatusCodeEnum;

  public async verifyEmail(request: Request, response: Response) {
    this.statusCode = HttpStatusCodeEnum.OK;
    const user = (request as AuthRequest).user;
    const { otp_token: emailVerifyToken } = request.body;

    if (!emailVerifyToken) throw new BadRequestError(INVALID_TOKEN);

    const results = await VerifyUserEmail.execute({
      user,
      emailVerificationToken: emailVerifyToken,
    });

    return response.status(this.statusCode).json({
      status: SUCCESS,
      status_code: this.statusCode,
      message: EMAIL_VERIFICATION_SUCCESS,
      results,
    });
  }

  public async emailSignIn(req: Request, res: Response) {
    this.statusCode = HttpStatusCodeEnum.OK;

    const { email, password } = req.body;

    const results = await SignInUserWithEmail.execute({
      email,
      password,
    });
    res.status(this.statusCode).json({
      status: SUCCESS,
      status_code: this.statusCode,
      message: SIGN_IN_SUCCESSFUL,
      results,
    });
  }

  public async requestEmailVerificationToken(req: Request, res: Response) {
    this.statusCode = HttpStatusCodeEnum.OK;
    const user = (req as AuthRequest).user;
    const queryRunner = await dbContext.getTransactionalQueryRunner();
    const results = await RequestEmailVerificationToken.execute({
      userId: user.id,
      queryRunner,
    });

    if (results !== SUCCESS) {
      this.statusCode = HttpStatusCodeEnum.INTERNAL_SERVER_ERROR;

      return res.status(this.statusCode).json({
        status: FAILURE,
        status_code: this.statusCode,
        message: SOMETHING_WENT_WRONG,
      });
    }
    return res.status(this.statusCode).json({
      status: SUCCESS,
      status_code: this.statusCode,
      message: EMAIL_VERIFICATION_TOKEN_REQUEST_SUCCESS,
    });
  }

  public async startPasswordRecovery(req: Request, res: Response) {
    this.statusCode = HttpStatusCodeEnum.OK;
    const { email } = req.body;
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    const startPasswordRecoveryArgs: StartPasswordRecoveryDtoType = {
      queryRunner,
      userEmail: email,
    };
    await StartPasswordRecovery.execute(startPasswordRecoveryArgs);

    res.status(this.statusCode).json({
      status: SUCCESS,
      status_code: this.statusCode,
      message: PASSWORD_RESET_LINK_GENERATED,
    });
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
