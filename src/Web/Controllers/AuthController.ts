import { Request, Response } from "express";
import { container } from "tsyringe";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { keysSnakeCaseToCamelCase } from "Utils/keysSnakeCaseToCamelCase";
import {
  SignupUserWithRoleUseCase,
  SignupUserWithRoleOptions,
} from "Logic/UseCases/Auth";

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
}

export default new AuthController();
