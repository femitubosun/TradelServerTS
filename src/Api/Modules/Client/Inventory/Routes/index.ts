import { Router } from "express";
import CustomerRoutes from "./CustomerRoutes";
import MerchantRoutes from "./MerchantRoutes";

const routes = Router();

routes.use("", CustomerRoutes);
routes.use("", MerchantRoutes);

export default routes;
