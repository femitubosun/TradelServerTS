import { Router } from "express";

import validate from "Api/Validators/Common/validate";
import RequestPasswordResetLinkController from "Api/Modules/Client/OnboardingAndAuthentication/Controllers/Authentication/RequestPasswordResetLinkController";
import ResetPasswordController from "Api/Modules/Client/OnboardingAndAuthentication/Controllers/Authentication/ResetPasswordController";
import EmailSignInController from "Api/Modules/Client/OnboardingAndAuthentication/Controllers/Authentication/EmailSignInController";
import {
  EmailSignInValidator,
  RequestPasswordResetLinkValidator,
  ResetPasswordValidator,
} from "Api/Modules/Client/OnboardingAndAuthentication/Validators/Authentication";

const routes = Router();

routes.post(
  "/Authenticate/UserEmail",
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
