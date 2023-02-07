import { Request, Response } from "express";
import { keysSnakeCaseToCamelCase } from "Utils/keysSnakeCaseToCamelCase";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  CUSTOMER_ONBOARDING_SUCCESS,
  FAILURE,
  MERCHANT_ONBOARDING_SUCCESS,
  SUCCESS,
} from "Utils/Messages";
import {
  CustomerOnboardingArgs,
  CustomerOnboardingUseCase,
} from "Logic/UseCases/Onboarding";
import { container } from "tsyringe";
import { DBContext } from "Lib/Infra/Internal/DBContext";

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
}

export default new OnboardingController();
