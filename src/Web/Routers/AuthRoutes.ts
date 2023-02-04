import { Router } from "express";
import AuthController from "src/Web/Controllers/AuthController";
import userSignUpValidator from "../Validators/Auth/userSignUpValidator";
import validate from "../Validators/Common/validate";
import userSignInValidator from "Web/Validators/Auth/userSignInValidator";

const routes = Router();

routes.post(
  "/Initiate/CustomerSignUp",
  userSignUpValidator,
  validate,
  AuthController.signupCustomer
);
routes.post(
  "/initiate/MerchantSignup",
  userSignUpValidator,
  validate,
  AuthController.signupMerchant
);

routes.post(
  "/Initiate/EmailSignIn",
  userSignInValidator,
  validate,
  AuthController.emailSignIn
);

routes.get("/Initiate/StartVerifyEmail", AuthController.verifyEmail);

routes.get("/Initiate/VerifyEmail/:token", AuthController.verifyEmail);

export default routes;
