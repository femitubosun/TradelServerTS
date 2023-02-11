import { Router } from "express";
import OnboardingController from "Web/Controllers/OnboardingController";
import validate from "Web/Validators/Common/validate";
import { customerOnboardingValidator } from "Web/Validators/Onboarding";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { authMiddleware } from "Web/Middleware/authMiddleware";

const routes = Router();

routes.post(
  "/Initiate/CustomerOnboarding",
  customerOnboardingValidator,
  validate,
  OnboardingController.onboardCustomer
);

routes.get(
  "/Initiate/EmailVerification/:emailVerifyToken",
  asyncMiddlewareHandler(authMiddleware),
  OnboardingController.emailVerification
);

routes.post(
  "/Initiate/MerchantOnboarding",
  OnboardingController.onboardMerchant
);

export default routes;
