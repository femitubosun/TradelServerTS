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
import AddItemToCartController from "Api/Modules/Client/Inventory/Controllers/Customer/Cart/AddItemToCartController";
import { AddItemToCartValidator } from "Api/Modules/Client/Inventory/Validators/Cart/AddItemToCartValidator";
import RemoveItemFromCartController from "Api/Modules/Client/Inventory/Controllers/Customer/Cart/RemoveItemFromCartController";
import { RemoveItemFromCartValidator } from "Api/Modules/Client/Inventory/Validators/Cart/RemoveItemFromCartValidator";
import { UpdateCartItemValidator } from "Api/Modules/Client/Inventory/Validators/Cart/UpdateCartItemValidator";
import UpdateCartItemController from "Api/Modules/Client/Inventory/Controllers/Customer/Cart/UpdateCartItemController";
import ClearCartController from "Api/Modules/Client/Inventory/Controllers/Customer/Cart/ClearCartController";
import ListActiveMerchantsController from "Api/Modules/Client/Inventory/Controllers/Customer/Merchant/ListActiveMerchantsController";
import FetchMerchantByIdentifierController from "Api/Modules/Client/Inventory/Controllers/Customer/Merchant/FetchMerchantByIdentifierController";

const routes = Router();

// Product Routes

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

//

routes.get(
  "/Fetch/Cart",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  FetchCartController.handle
);

routes.post(
  "/Process/AddItemToCart",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  AddItemToCartValidator,
  validate,
  AddItemToCartController.handle
);

routes.post(
  "/Process/RemoveItemFromCart",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  RemoveItemFromCartValidator,
  validate,
  RemoveItemFromCartController.handle
);

routes.get(
  "/Process/ClearCart",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  ClearCartController.handle
);

routes.patch(
  "/Update/CartItem/:cartItemIdentifier",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  UpdateCartItemValidator,
  validate,
  UpdateCartItemController.handle
);

// Merchants

routes.get(
  "/Fetch/Merchants",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  ListActiveMerchantsController.handle
);

routes.get(
  "/Fetch/Merchants/:merchantIdentifier",
  //TODO Add Validator
  FetchMerchantByIdentifierController.handle
);

routes.get(
  "/Fetch/Merchants/:merchantIdentifier/Products",
  asyncMiddlewareHandler(isAuthenticated),
  ListActiveProductsByMerchantValidator,
  validate,
  ListActiveProductsByMerchantController.handle
);

export default routes;
