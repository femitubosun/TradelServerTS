import { Request, Response } from "express";
import { keysSnakeCaseToCamelCase } from "Utils/keysSnakeCaseToCamelCase";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  CustomerOnboardingUseCaseArgs,
  OnboardCustomer,
  MerchantOnboardingUseCaseArgs,
  OnboardMerchant,
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
  private statusCode: HttpStatusCodeEnum;

  public async onboardCustomer(req: Request, res: Response) {
    this.statusCode = HttpStatusCodeEnum.CREATED;
    const mutantOnboardCustomerRequest: any = keysSnakeCaseToCamelCase(
      req.body
    );
    const queryRunner = await dbContext.getTransactionalQueryRunner();
    const customerOnboardingUseCaseArgs: CustomerOnboardingUseCaseArgs = {
      ...mutantOnboardCustomerRequest,
      queryRunner,
    };

    const results = await OnboardCustomer.execute(
      customerOnboardingUseCaseArgs
    );

    return res.status(this.statusCode).json({
      status: SUCCESS,
      status_code: this.statusCode,
      message: CUSTOMER_ONBOARDING_SUCCESS,
      results,
    });
  }

  public async onboardMerchant(req: Request, res: Response) {
    this.statusCode = HttpStatusCodeEnum.CREATED;

    const mutantOnboardMerchantRequest: any = keysSnakeCaseToCamelCase(
      req.body
    );

    const queryRunner = await dbContext.getTransactionalQueryRunner();

    const merchantOnboardingUseCaseArgs: MerchantOnboardingUseCaseArgs = {
      ...mutantOnboardMerchantRequest,
      queryRunner,
    };

    const results = await OnboardMerchant.execute(
      merchantOnboardingUseCaseArgs
    );

    return res.status(this.statusCode).json({
      status: SUCCESS,
      status_code: this.statusCode,
      message: MERCHANT_ONBOARDING_SUCCESS,
      results,
    });
  }
}

export default new OnboardingController();
