import { Request, Response } from "express";
import { keysSnakeCaseToCamelCase } from "Utils/keysSnakeCaseToCamelCase";
import { SignUpUserWithRoleUseCase } from "Logic/UseCases/Auth";
import { HttpCode } from "Logic/Exceptions/httpCode.enum";
import { SIGN_IN_SUCCESSFUL } from "Utils/Messages";
import { SignUpUserWithRoleDTO } from "Logic/UseCases/Auth/TypeSetting";
import { SignInUserWithEmailUseCase } from "Logic/UseCases/Auth/SignInUserWithEmail.UseCase";

class AuthController {
  public async signupCustomer(req: Request, res: Response) {
    const payload: any = keysSnakeCaseToCamelCase(req.body);
    const signUpUserWithRoleDTO: SignUpUserWithRoleDTO = {
      ...payload,
      roleName: "customer",
    };

    const results = await SignUpUserWithRoleUseCase.execute(
      signUpUserWithRoleDTO
    );
    return res.status(201).json({
      status: "Success",
      status_code: 201,
      message: "Customer Signed Up Successfully",
      results,
    });
  }

  public async signupMerchant(req: Request, res: Response) {
    const payload: any = keysSnakeCaseToCamelCase(req.body);
    const signupUserWithRoleOptions: SignUpUserWithRoleDTO = {
      ...payload,
      roleName: "merchant",
    };
    const results = await SignUpUserWithRoleUseCase.execute(
      signupUserWithRoleOptions
    );
    return res.status(201).json({
      status: "success",
      status_code: 201,
      message: "Merchant Signed Up Successfully",
      results,
    });
  }

  public async verifyEmail(req: Request, res: Response) {}

  public async emailSignIn(req: Request, res: Response) {
    const payload: any = keysSnakeCaseToCamelCase(req.body);
    const results = await SignInUserWithEmailUseCase.execute(payload);
    res.status(HttpCode.OK).json({
      status: "Success",
      status_code: HttpCode.OK,
      message: SIGN_IN_SUCCESSFUL,
      results,
    });
  }
}

export default new AuthController();
