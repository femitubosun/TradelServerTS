import { Router } from "express";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import ListActiveProductsController from "Api/Modules/Client/Inventory/Controllers/Customer/Product/ListActiveProductsController";
import { MerchantIdentifierIsValidUuidValidator } from "Api/Modules/Client/Inventory/Validators/Product/MerchantIdentifierIsValidUuidValidator";
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
import ListActiveMerchantsController from "Api/Modules/Client/Profile/Controllers/Customer/Merchant/ListActiveMerchantsController";
import FetchMerchantByIdentifierController from "Api/Modules/Client/Profile/Controllers/Customer/Merchant/FetchMerchantByIdentifierController";
import ListProductVariantsByProductController from "Api/Modules/Client/Inventory/Controllers/Customer/ProductVariant/ListProductVariantsByProductController";
import FetchProductVariantByIdentifierController from "Api/Modules/Client/Inventory/Controllers/Customer/ProductVariant/FetchProductVariantByIdentifierController";
import { AccessProductIdentifierValidator } from "Api/Modules/Client/Inventory/Validators/ProductVariant/AccessProductIdentifierValidator";
import { AccessProductVariantIdentifierValidator } from "Api/Modules/Client/Inventory/Validators/ProductVariant/AccessProductVariantIdentifierValidator";
import SearchProductByNameController from "Api/Modules/Client/Inventory/Controllers/Customer/Product/SearchProductByNameController";
import SearchMerchantByNameController from "Api/Modules/Client/Profile/Controllers/Customer/Merchant/SearchMerchantByNameController";

const routes = Router();

/*-------------------------------<  Product Routes  >---------------------------*/

routes.get(
  "/Fetch/ActiveProducts",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  ListActiveProductsController.handle
);

routes.get(
  "/Fetch/Products/:productIdentifier",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  AccessProductIdentifierValidator,
  validate,
  FetchProductByIdentifierController.handle
);

/*--------------------------------<  Cart Routes  >----------------------------- */

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

/*------------------------------<  Product Variant  >--------------------------- */

routes.get(
  "/Fetch/ListProductVariantsByProduct/:productIdentifier",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  AccessProductIdentifierValidator,
  validate,

  ListProductVariantsByProductController.handle
);

routes.get(
  "/Fetch/ProductVariants/:productVariantIdentifier",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  AccessProductVariantIdentifierValidator,
  validate,
  FetchProductVariantByIdentifierController.handle
);

routes.get(
  "/Process/SearchProduct/",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  SearchProductByNameController.handle
);

export default routes;
