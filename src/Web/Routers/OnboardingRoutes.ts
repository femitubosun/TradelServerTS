import { Router } from "express";
import OnboardingController from "Web/Controllers/OnboardingController";
import validate from "Web/Validators/Common/validate";
import { customerOnboardingValidator } from "Web/Validators/Onboarding";

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
