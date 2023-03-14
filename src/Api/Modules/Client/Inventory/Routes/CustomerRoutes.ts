import { Router } from "express";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isAuthenticated } from "Api/Middleware/isAuthenticated";
import ListActiveProductsController from "Api/Modules/Client/Inventory/Controllers/Customer/Product/ListActiveProductsController";
import { ListActiveProductsByMerchantValidator } from "Api/Modules/Client/Inventory/Validators/Product/ListActiveProductsByMerchantValidator";
import validate from "Api/Validators/Common/validate";
import ListActiveProductsByMerchantController from "Api/Modules/Client/Inventory/Controllers/Customer/Product/ListActiveProductsByMerchantController";
import FetchProductByIdentifierController from "Api/Modules/Client/Inventory/Controllers/Customer/Product/FetchProductByIdentifierController";
import { isRole } from "Api/Middleware/isRole";
import { CUSTOMER_ROLE_NAME } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import FetchCartController from "Api/Modules/Client/Inventory/Controllers/Customer/Cart/FetchCartController";
import AddProductToCartController from "Api/Modules/Client/Inventory/Controllers/Customer/Cart/AddProductToCartController";
import { AddProductToCartValidator } from "Api/Modules/Client/Inventory/Validators/Cart/AddProductToCartValidator";
import RemoveProductFromCartController from "Api/Modules/Client/Inventory/Controllers/Customer/Cart/RemoveProductFromCartController";
import { RemoveProductFromCartValidator } from "Api/Modules/Client/Inventory/Validators/Cart/RemoveProductFromCartValidator";

const routes = Router();

routes.get(
  "/Fetch/ActiveProducts",
  asyncMiddlewareHandler(isAuthenticated),
  ListActiveProductsController.handle
);

routes.get(
  "/Fetch/Products/:productIdentifier",
  asyncMiddlewareHandler(isAuthenticated),
  FetchProductByIdentifierController.handle
);

routes.get(
  "/Fetch/ActiveProductsByMerchant/:merchantIdentifier",
  asyncMiddlewareHandler(isAuthenticated),
  ListActiveProductsByMerchantValidator,
  validate,
  ListActiveProductsByMerchantController.handle
);

routes.get(
  "/Fetch/Cart",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  FetchCartController.handle
);

routes.post(
  "/Process/AddProductToCart",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  AddProductToCartValidator,
  validate,
  AddProductToCartController.handle
);

routes.post(
  "/Process/RemoveProductFromCart",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  RemoveProductFromCartValidator,
  validate,
  RemoveProductFromCartController.handle
);

export default routes;
