import { Router } from "express";
import authRoutes from "Api/Routes/Auth/AuthRoutes";
import onboardingRoutes from "Api/Routes/Onboarding/OnboardingRoutes";
import productRoutes from "Api/Routes/Customer/ProductRoutes";

const routes = Router();

routes.use("", authRoutes);
routes.use("", onboardingRoutes);
routes.use("", productRoutes);

export default routes;
