import { Request, Response } from "express";
import { keysSnakeCaseToCamelCase } from "Utils/keysSnakeCaseToCamelCase";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  CreateCustomerUseCaseDtoType,
  CreateCustomer,
  MerchantOnboardingUseCaseArgs,
  CreateMerchant,
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
    const {
      first_name: firstName,
      last_name: lastName,
      password,
      phone_number: phoneNumber,
      email,
    } = req.body;

    const queryRunner = await dbContext.getTransactionalQueryRunner();

    const customerOnboardingUseCaseArgs: CreateCustomerUseCaseDtoType = {
      email,
      firstName,
      lastName,
      password,
      phoneNumber,
      queryRunner,
    };

    const results = await CreateCustomer.execute(customerOnboardingUseCaseArgs);

    return res.status(this.statusCode).json({
      status: SUCCESS,
      status_code: this.statusCode,
      message: CUSTOMER_ONBOARDING_SUCCESS,
      results,
    });
  }

  public async onboardMerchant(req: Request, res: Response) {
    this.statusCode = HttpStatusCodeEnum.CREATED;

    const mutantOnboardMerchantRequest = keysSnakeCaseToCamelCase(req.body);

    const queryRunner = await dbContext.getTransactionalQueryRunner();

    const merchantOnboardingUseCaseArgs = {
      ...mutantOnboardMerchantRequest,
      queryRunner,
    };

    const results = await CreateMerchant.execute(
      merchantOnboardingUseCaseArgs as MerchantOnboardingUseCaseArgs
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
