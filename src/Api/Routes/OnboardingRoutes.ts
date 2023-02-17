import { Router } from "express";
import OnboardingController from "Api/Controllers/OnboardingController";
import validate from "Api/Validators/Common/validate";
import { customerOnboardingValidator } from "Api/Validators/Onboarding";

const routes = Router();

routes.post(
  "/Initiate/CustomerOnboarding",
  customerOnboardingValidator,
  validate,
  OnboardingController.onboardCustomer
);

routes.post(
  "/Initiate/MerchantOnboarding",
  OnboardingController.onboardMerchant
);

export default routes;
