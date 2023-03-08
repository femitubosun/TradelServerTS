import AuthenticationRoutes from "Api/Modules/Client/OnboardingAndAuthentication/Routes/AuthenticationRoutes";
import OnboardingRoutes from "Api/Modules/Client/OnboardingAndAuthentication/Routes/OnboardingRoutes";
import { Router } from "express";

const routes = Router();

routes.use("", AuthenticationRoutes);
routes.use("", OnboardingRoutes);

export default routes;
