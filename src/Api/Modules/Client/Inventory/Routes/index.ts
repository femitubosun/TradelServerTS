import { Router } from "express";
import ProductRoutes from "./ProductRoutes";

const routes = Router();

routes.use("", ProductRoutes);

export default routes;
