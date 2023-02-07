import { Request, Response } from "express";
import { keysSnakeCaseToCamelCase } from "Utils/keysSnakeCaseToCamelCase";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import { SIGN_IN_SUCCESSFUL, SUCCESS } from "Utils/Messages";
import { SignInUserWithEmailUseCase } from "Logic/UseCases/Auth/SignInUserWithEmail.UseCase";

class AuthController {
  public async verifyEmail(req: Request, res: Response) {}

  public async emailSignIn(req: Request, res: Response) {
    const payload: any = keysSnakeCaseToCamelCase(req.body);
    const results = await SignInUserWithEmailUseCase.execute(payload);
    res.status(HttpStatusCodeEnum.OK).json({
      status: SUCCESS,
      status_code: HttpStatusCodeEnum.OK,
      message: SIGN_IN_SUCCESSFUL,
      results,
    });
  }
}

export default new AuthController();
