import { Request, Response } from "express";
import { keysSnakeCaseToCamelCase } from "Utils/keysSnakeCaseToCamelCase";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import { SignInUserWithEmailUseCase } from "Logic/UseCases/Auth/SignInUserWithEmail.UseCase";
import { AuthRequest } from "../TypeChecking";
import { EmailVerificationUseCase } from "Logic/UseCases/Onboarding";
import { RequestEmailVerificationTokenUseCase } from "Logic/UseCases/Auth/RequestEmailVerificationTokenUseCase";
import {
  EMAIL_VERIFICATION_SUCCESS,
  EMAIL_VERIFICATION_TOKEN_REQUEST_SUCCESS,
  SIGN_IN_SUCCESSFUL,
  SUCCESS,
} from "Helpers/Messages/SystemMessages";

class AuthController {
  public statusCode: HttpStatusCodeEnum;

  public async verifyEmail(req: Request, res: Response) {
    this.statusCode = HttpStatusCodeEnum.OK;
    const user = (req as AuthRequest).user;
    const emailVerifyToken = req.params["emailVerifyToken"];

    const results = await EmailVerificationUseCase.execute({
      user,
      emailVerificationToken: emailVerifyToken,
    });

    return res.status(this.statusCode).json({
      status: SUCCESS,
      status_code: this.statusCode,
      message: EMAIL_VERIFICATION_SUCCESS,
      results,
    });
  }

  public async requestEmailVerificationToken(req: Request, res: Response) {
    this.statusCode = HttpStatusCodeEnum.OK;
    const user = (req as AuthRequest).user;
    const results = await RequestEmailVerificationTokenUseCase.execute(user);

    return res.status(this.statusCode).json({
      status: SUCCESS,
      status_code: this.statusCode,
      message: EMAIL_VERIFICATION_TOKEN_REQUEST_SUCCESS,
      results,
    });
  }

  public async emailSignIn(req: Request, res: Response) {
    this.statusCode = HttpStatusCodeEnum.OK;
    const payload: any = keysSnakeCaseToCamelCase(req.body);
    const results = await SignInUserWithEmailUseCase.execute(payload);
    res.status(this.statusCode).json({
      status: SUCCESS,
      status_code: this.statusCode,
      message: SIGN_IN_SUCCESSFUL,
      results,
    });
  }

  public async startForgotPasswordProcess(req: Request, res: Response) {}

  public async changePassword(req: Request, res: Response) {}
}

export default new AuthController();
