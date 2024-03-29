import { Router } from "express";
import validate from "Api/Validators/Common/validate";
import {
  CreateNewCustomerValidator,
  CreateNewMerchantValidator,
  VerifyEmailValidator,
} from "Api/Modules/Client/OnboardingAndAuthentication/Validators/Onboarding";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isAuthenticated } from "Api/Middleware/isAuthenticated";
import VerifyEmailController from "Api/Modules/Client/OnboardingAndAuthentication/Controllers/Onboarding/VerifyEmailController";
import RequestNewEmailVerificationTokenController from "Api/Modules/Client/OnboardingAndAuthentication/Controllers/Onboarding/RequestNewEmailVerificationTokenController";
import CreateNewCustomerController from "Api/Modules/Client/OnboardingAndAuthentication/Controllers/Onboarding/CreateNewCustomerController";
import CreateNewMerchantController from "Api/Modules/Client/OnboardingAndAuthentication/Controllers/Onboarding/CreateNewMerchantController";

const routes = Router();

routes.post(
  "/Create/Customer",
  CreateNewCustomerValidator,
  validate,
  CreateNewCustomerController.handle
);

routes.post(
  "/Create/Merchant",
  CreateNewMerchantValidator,
  validate,
  CreateNewMerchantController.handle
);

routes.post(
  "/Process/VerifyEmail",
  asyncMiddlewareHandler(isAuthenticated),
  VerifyEmailValidator,
  validate,
  VerifyEmailController.handle
);

routes.get(
  "/Process/RequestEmailVerificationToken",
  asyncMiddlewareHandler(isAuthenticated),
  RequestNewEmailVerificationTokenController.handle
);

export default routes;
