import { Request, Response } from "express";
import { keysSnakeCaseToCamelCase } from "Utils/keysSnakeCaseToCamelCase";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import { SignInUserWithEmailUseCase } from "Logic/UseCases/Auth/SignInUserWithEmail.UseCase";
import { AuthRequest } from "../TypeChecking";
import { VerifyUserEmail } from "Logic/UseCases/Onboarding";
import { RequestEmailVerificationToken } from "Logic/UseCases/Auth/RequestEmailVerificationToken";
import {
  EMAIL_VERIFICATION_SUCCESS,
  EMAIL_VERIFICATION_TOKEN_REQUEST_SUCCESS,
  SIGN_IN_SUCCESSFUL,
  SUCCESS,
} from "Helpers/Messages/SystemMessages";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";

const dbContext = container.resolve(DbContext);

class AuthController {
  public statusCode: HttpStatusCodeEnum;

  public async verifyEmail(req: Request, res: Response) {
    this.statusCode = HttpStatusCodeEnum.OK;
    const user = (req as AuthRequest).user;
    const emailVerifyToken = req.params["emailVerifyToken"];

    const results = await VerifyUserEmail.execute({
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
    const queryRunner = await dbContext.getTransactionalQueryRunner();
    const results = await RequestEmailVerificationToken.execute({
      userId: user.id,
      queryRunner,
    });

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

  public async startPasswordRecovery(req: Request, res: Response) {}

  public async changePassword(req: Request, res: Response) {}
}

export default new AuthController();
