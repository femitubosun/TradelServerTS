import { Router } from "express";
import authRoutes from "Api/Routes/Auth/AuthRoutes";
import onboardingRoutes from "Api/Routes/Onboarding/OnboardingRoutes";
import productRoutes from "Api/Routes/Customer/ProductRoutes";
import productCategoryRoutes from "Api/Routes/Customer/ProductCategoryRoutes";

const routes = Router();

routes.use("", authRoutes);
routes.use("", onboardingRoutes);
routes.use("", productRoutes);
routes.use("", productCategoryRoutes);

export default routes;
