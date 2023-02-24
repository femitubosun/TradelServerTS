import { Router } from "express";
import ProductCategoryController from "Api/Controllers/Customer/ProductCategoryController";

const routes = Router();

routes.get(
  "/Fetch/ActiveProductCategories",
  ProductCategoryController.listActiveProductCategories
);

routes.get(
  "/Fetch/ProductCategories/:productCategoryIdentifier",
  ProductCategoryController.getProductCategory
);

export default routes;
