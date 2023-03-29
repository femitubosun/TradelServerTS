import { Router } from "express";
import OrderRoutes from "./OrderRoutes";

const routes = Router();

routes.use("", OrderRoutes);

export default routes;
