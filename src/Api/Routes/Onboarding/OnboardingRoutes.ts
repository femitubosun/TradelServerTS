import { Router } from "express";
import OnboardingController from "Api/Controllers/Onboarding/OnboardingController";
import validate from "Api/Validators/Common/validate";
import {
  customerOnboardingValidator,
  merchantOnboardingValidator,
} from "Api/Validators/Onboarding";

const routes = Router();

routes.post(
  "/Create/Customer",
  customerOnboardingValidator,
  validate,
  OnboardingController.onboardCustomer
);

routes.post(
  "/Initiate/MerchantOnboarding",
  merchantOnboardingValidator,
  validate,
  OnboardingController.onboardMerchant
);

export default routes;
