import { Request, Response } from "express";
import { keysSnakeCaseToCamelCase } from "Utils/keysSnakeCaseToCamelCase";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  CUSTOMER_ONBOARDING_SUCCESS,
  EMAIL_VERIFICATION_SUCCESS,
  MERCHANT_ONBOARDING_SUCCESS,
  SUCCESS,
} from "Utils/Messages";
import {
  CustomerOnboardingArgs,
  CustomerOnboardingUseCase,
  EmailVerificationUseCase,
} from "Logic/UseCases/Onboarding";
import { container } from "tsyringe";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { AuthRequest } from "Web/TypeChecking";

const dbContext = container.resolve(DBContext);

class OnboardingController {
  public async onboardCustomer(req: Request, res: Response) {
    const payload: any = keysSnakeCaseToCamelCase(req.body);
    const queryRunner = await dbContext.getTransactionalQueryRunner();
    const customerOnboardingArgs: CustomerOnboardingArgs = {
      ...payload,
      queryRunner,
    };

    const results = await CustomerOnboardingUseCase.execute(
      customerOnboardingArgs
    );

    return res.status(HttpStatusCodeEnum.CREATED).json({
      status: SUCCESS,
      status_code: HttpStatusCodeEnum.CREATED,
      message: CUSTOMER_ONBOARDING_SUCCESS,
      results,
    });
  }

  public async onboardMerchant(req: Request, res: Response) {
    return res.status(HttpStatusCodeEnum.CREATED).json({
      status: SUCCESS,
      status_code: HttpStatusCodeEnum.CREATED,
      message: MERCHANT_ONBOARDING_SUCCESS,
    });
  }

  public async emailVerification(req: Request, res: Response) {
    const user = (req as AuthRequest).user;
    const emailVerifyToken = req.params["emailVerifyToken"];

    const results = await EmailVerificationUseCase.execute({
      user,
      emailVerificationToken: emailVerifyToken,
    });
    return res.status(HttpStatusCodeEnum.OK).json({
      status: SUCCESS,
      status_code: HttpStatusCodeEnum.OK,
      message: EMAIL_VERIFICATION_SUCCESS,
      results,
    });
  }
}

export default new OnboardingController();
