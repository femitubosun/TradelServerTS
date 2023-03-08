import { Router } from "express";

import validate from "Api/Validators/Common/validate";
import RequestPasswordResetLinkController from "Api/Modules/OnboardingAndAuthentication/Controllers/Authentication/RequestPasswordResetLinkController";
import ResetPasswordController from "Api/Modules/OnboardingAndAuthentication/Controllers/Authentication/ResetPasswordController";
import EmailSignInController from "Api/Modules/OnboardingAndAuthentication/Controllers/Authentication/EmailSignInController";
import {
  EmailSignInValidator,
  ResetPasswordValidator,
  RequestPasswordResetLinkValidator,
} from "Api/Modules/OnboardingAndAuthentication/Validators/Authentication";

const routes = Router();

routes.post(
  "/Process/EmailSignIn",
  EmailSignInValidator,
  validate,
  EmailSignInController.handle
);

routes.post(
  "/Process/RequestPasswordResetLink",
  RequestPasswordResetLinkValidator,
  validate,
  RequestPasswordResetLinkController.handle
);

routes.post(
  "/Process/ResetPassword/:passwordResetToken",
  ResetPasswordValidator,
  validate,
  ResetPasswordController.handle
);

export default routes;
