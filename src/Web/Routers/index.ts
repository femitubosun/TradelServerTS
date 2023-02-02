import { Router } from "express";
import authRoutes from "Web/Routers/AuthRoutes";

const routes = Router();

routes.use("/", authRoutes);

export default routes;
