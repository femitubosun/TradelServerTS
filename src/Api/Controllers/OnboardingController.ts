import { Request, Response } from "express";
import { keysSnakeCaseToCamelCase } from "Utils/keysSnakeCaseToCamelCase";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  CustomerOnboardingUseCaseArgs,
  CustomerOnboardingUseCase,
} from "Logic/UseCases/Onboarding";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import {
  CUSTOMER_ONBOARDING_SUCCESS,
  MERCHANT_ONBOARDING_SUCCESS,
  SUCCESS,
} from "Helpers/Messages/SystemMessages";

const dbContext = container.resolve(DbContext);

class OnboardingController {
  public async onboardCustomer(req: Request, res: Response) {
    let statusCode = HttpStatusCodeEnum.CREATED;
    const mutantOnboardCustomerRequest: any = keysSnakeCaseToCamelCase(
      req.body
    );
    const queryRunner = await dbContext.getTransactionalQueryRunner();
    const customerOnboardingUseCaseArgs: CustomerOnboardingUseCaseArgs = {
      ...mutantOnboardCustomerRequest,
      queryRunner,
    };

    const results = await CustomerOnboardingUseCase.execute(
      customerOnboardingUseCaseArgs
    );

    return res.status(statusCode).json({
      status: SUCCESS,
      status_code: statusCode,
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
