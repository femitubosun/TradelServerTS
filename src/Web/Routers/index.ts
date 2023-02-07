import { Router } from "express";
import authRoutes from "Web/Routers/AuthRoutes";
import onboardingRoutes from "Web/Routers/OnboardingRoutes";

const routes = Router();

routes.use("/", authRoutes);
routes.use("", onboardingRoutes);

export default routes;
