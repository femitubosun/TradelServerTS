import { Router } from "express";
import AuthController from "src/Web/Controllers/AuthController";
import userSignupValidator from "../Validators/Auth/userSignupValidator";
import validate from "../Validators/Common/validate";

const routes = Router();

routes.post(
  "/Initiate/CustomerSignUp",
  userSignupValidator,
  validate,
  AuthController.signupCustomer
);
routes.post(
  "/initiate/MerchantSignup",
  userSignupValidator,
  validate,
  AuthController.signupMerchant
);

export default routes;
