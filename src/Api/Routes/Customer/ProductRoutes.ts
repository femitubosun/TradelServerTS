import { Router } from "express";
import ProductController from "Api/Controllers/Customer/ProductController";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isAuthenticated } from "Api/Middleware/isAuthenticated";

const routes = Router();

routes.get(
  "/Fetch/Products",
  asyncMiddlewareHandler(isAuthenticated),
  ProductController.listActiveProducts
);

export default routes;
