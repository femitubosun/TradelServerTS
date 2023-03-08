import { Router } from "express";
import AuthController from "Api/Controllers/Auth/AuthController";
import validate from "Api/Validators/Common/validate";
import userSignInValidator from "Api/Validators/Auth/userSignInValidator";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isAuthenticated } from "Api/Middleware/isAuthenticated";
import RequestPasswordResetLinkValidator from "Api/Modules/Client/OnboardingAndAuthentication/Validators/Authentication/RequestPasswordResetLinkValidator";
import resetPasswordValidator from "Api/Modules/Client/OnboardingAndAuthentication/Validators/Authentication/ResetPasswordValidator";
import VerifyEmailValidator from "Api/Modules/Client/OnboardingAndAuthentication/Validators/Onboarding/VerifyEmailValidator";

const routes = Router();

// routes.post(
//   "/Process/EmailSignIn",
//   userSignInValidator,
//   validate,
//   AuthController.emailSignIn
// );

// routes.post(
//   "/Process/VerifyEmail/",
//   asyncMiddlewareHandler(isAuthenticated),
//   verifyEmailValidator,
//   validate,
//   AuthController.verifyEmail
// );
//
// routes.get(
//   "/Process/RequestEmailVerificationToken",
//   asyncMiddlewareHandler(isAuthenticated),
//   AuthController.requestEmailVerificationToken
// );

export default routes;
