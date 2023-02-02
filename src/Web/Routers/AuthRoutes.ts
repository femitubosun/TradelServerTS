import { Router } from "express";
import AuthController from "src/Web/Controllers/AuthController";
import customerSignupValidator from "../Validators/Auth/customerSignupValidator";
import validate from "../Validators/Common/validate";

const routes = Router();

routes.post(
  "/Initiate/CustomerSignUp",
  customerSignupValidator,
  validate,
  AuthController.signupCustomer
);
routes.get("/initiate/merchant-signup", AuthController.signupMerchant);

export default routes;
