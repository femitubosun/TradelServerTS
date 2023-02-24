import { Router } from "express";
import ProductCategoryController from "Api/Controllers/Customer/ProductCategoryController";

const routes = Router();

routes.get(
  "/Fetch/ProductCategories",
  ProductCategoryController.listActiveProductCategories
);

routes.get(
  "/Fetch/ProductCategories/:productCategoryIdentifier",
  ProductCategoryController.getProductCategory
);

export default routes;
