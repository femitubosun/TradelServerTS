import { Request, Response } from "express";
import { container } from "tsyringe";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { keysSnakeCaseToCamelCase } from "Utils/keysSnakeCaseToCamelCase";
import {
  SignupUserWithRoleUseCase,
  SignupUserWithRoleOptions,
} from "Logic/UseCases/Auth";
import { HttpCode } from "Logic/Exceptions/httpCode.enum";
import { SIGNIN_SUCCESSFUL } from "Utils/Messages";

const dbContext = container.resolve(DBContext);

class AuthController {
  public async signupCustomer(req: Request, res: Response) {
    const data: any = keysSnakeCaseToCamelCase(req.body);
    const signupUserWithRoleOptions: SignupUserWithRoleOptions = {
      ...data,
      roleName: "customer",
    };

    await SignupUserWithRoleUseCase.execute(
      dbContext,
      signupUserWithRoleOptions
    );
    return res.status(201).json({
      status: "Success",
      status_code: 201,
      message: "Customer Signed Up Successfully",
      results: null,
    });
  }

  public async signupMerchant(req: Request, res: Response) {
    const data: any = keysSnakeCaseToCamelCase(req.body);
    const signupUserWithRoleOptions: SignupUserWithRoleOptions = {
      ...data,
      roleName: "merchant",
    };

    await SignupUserWithRoleUseCase.execute(
      dbContext,
      signupUserWithRoleOptions
    );
    return res.status(201).json({
      status: "success",
      status_code: 201,
      message: "Merchant Signed Up Successfully",
      results: null,
    });
  }

  public async emailSignIn(req: Request, res: Response) {
    res.status(HttpCode.OK).json({
      status: "Success",
      status_code: HttpCode.OK,
      message: SIGNIN_SUCCESSFUL,
      results: {
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QGVtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.I3Ryi7y0Dco_wsPDwdUYnEyWRMsltjmopopbwM8E21Y",
      },
    });
  }
}

export default new AuthController();
