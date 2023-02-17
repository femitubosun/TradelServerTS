import { Router } from "express";
import authRoutes from "Api/Routes/AuthRoutes";
import onboardingRoutes from "Api/Routes/OnboardingRoutes";

const routes = Router();

routes.use("", authRoutes);
routes.use("", onboardingRoutes);

export default routes;
