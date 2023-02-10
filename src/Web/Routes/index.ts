import { Router } from "express";
import authRoutes from "Web/Routes/AuthRoutes";
import onboardingRoutes from "Web/Routes/OnboardingRoutes";

const routes = Router();

routes.use("/", authRoutes);
routes.use("", onboardingRoutes);

export default routes;
