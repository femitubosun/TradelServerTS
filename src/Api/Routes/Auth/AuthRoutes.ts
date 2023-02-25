import { Router } from "express";
import AuthController from "Api/Controllers/Auth/AuthController";
import validate from "Api/Validators/Common/validate";
import userSignInValidator from "Api/Validators/Auth/userSignInValidator";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isAuthenticated } from "Api/Middleware/isAuthenticated";
import requestPasswordResetLinkValidator from "Api/Validators/Auth/requestPasswordResetLinkValidator";
import resetPasswordValidator from "Api/Validators/Auth/resetPasswordValidator";
import emailVerificationValidator from "Api/Validators/Auth/emailVerificationValidator";

const routes = Router();

routes.post(
  "/Process/EmailSignIn",
  userSignInValidator,
  validate,
  AuthController.emailSignIn
);

routes.post(
  "/Process/VerifyEmail/",
  asyncMiddlewareHandler(isAuthenticated),
  emailVerificationValidator,
  validate,
  AuthController.verifyEmail
);

routes.get(
  "/Process/RequestEmailVerificationToken",
  asyncMiddlewareHandler(isAuthenticated),
  AuthController.requestEmailVerificationToken
);

routes.post(
  "/Process/RequestPasswordResetLink",
  requestPasswordResetLinkValidator,
  validate,
  AuthController.requestPasswordResetLink
);

routes.post(
  "/Process/ResetPassword/:passwordResetToken",
  resetPasswordValidator,
  validate,
  AuthController.resetPassword
);

export default routes;
