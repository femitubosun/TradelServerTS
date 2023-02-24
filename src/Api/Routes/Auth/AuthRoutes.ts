import { Router } from "express";
import AuthController from "Api/Controllers/Auth/AuthController";
import validate from "Api/Validators/Common/validate";
import userSignInValidator from "Api/Validators/Auth/userSignInValidator";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isAuthenticated } from "Api/Middleware/isAuthenticated";
import recoverPasswordValidator from "Api/Validators/Auth/RecoverPasswordValidator";
import resetPasswordValidator from "Api/Validators/Auth/ResetPasswordValidator";
import emailVerificationValidator from "Api/Validators/Auth/EmailVerificationValidator";

const routes = Router();

routes.post(
  "/Initiate/EmailSignIn",
  userSignInValidator,
  validate,
  AuthController.emailSignIn
);

routes.post(
  "/Process/EmailVerification/",
  asyncMiddlewareHandler(isAuthenticated),
  emailVerificationValidator,
  validate,
  AuthController.verifyEmail
);

routes.get(
  "/Initiate/RequestEmailVerificationToken",
  asyncMiddlewareHandler(isAuthenticated),
  AuthController.requestEmailVerificationToken
);

routes.post(
  "/Initiate/PasswordRecovery",
  recoverPasswordValidator,
  validate,
  AuthController.startPasswordRecovery
);

routes.post(
  "/Initiate/ResetPassword/:passwordResetToken",
  resetPasswordValidator,
  validate,
  AuthController.resetPassword
);

export default routes;
