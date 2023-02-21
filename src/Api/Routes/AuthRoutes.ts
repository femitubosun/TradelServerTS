import { Router } from "express";
import AuthController from "Api/Controllers/AuthController";
import validate from "Api/Validators/Common/validate";
import userSignInValidator from "Api/Validators/Auth/userSignInValidator";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isAuthenticated } from "Api/Middleware/isAuthenticated";
import recoverPasswordValidator from "Api/Validators/Auth/RecoverPasswordValidator";
import passwordResetMail from "Logic/Services/Template/templates/passwordResetMail";
import resetPasswordValidator from "Api/Validators/Auth/ResetPasswordValidator";

const routes = Router();

routes.post(
  "/Initiate/EmailSignIn",
  userSignInValidator,
  validate,
  AuthController.emailSignIn
);

routes.get(
  "/Initiate/EmailVerification/:emailVerifyToken",
  asyncMiddlewareHandler(isAuthenticated),
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
