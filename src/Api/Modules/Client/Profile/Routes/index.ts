import { Router } from "express";
import CustomerRoutes from "./CustomerRoutes";

const routes = Router();

routes.use("", CustomerRoutes);

export default routes;
