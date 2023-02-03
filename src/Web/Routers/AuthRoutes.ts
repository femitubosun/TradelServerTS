import { Router } from "express";
import AuthController from "src/Web/Controllers/AuthController";
import userSignUpValidator from "../Validators/Auth/userSignUpValidator";
import validate from "../Validators/Common/validate";

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
  "Initiate/SignIn",
  userSignUpValidator,
  validate,
  AuthController.emailSignIn
);

export default routes;
