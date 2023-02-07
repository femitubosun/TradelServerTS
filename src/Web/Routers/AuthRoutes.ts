import { Router } from "express";
import AuthController from "Web/Controllers/AuthController";
import validate from "Web/Validators/Common/validate";
import userSignInValidator from "Web/Validators/Auth/userSignInValidator";

const routes = Router();

routes.post(
  "/Initiate/EmailSignIn",
  userSignInValidator,
  validate,
  AuthController.emailSignIn
);

routes.get("/Initiate/StartVerifyEmail", AuthController.verifyEmail);

routes.get("/Initiate/VerifyEmail/:token", AuthController.verifyEmail);

export default routes;
