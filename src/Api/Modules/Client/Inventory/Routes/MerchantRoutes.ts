import { Router } from "express";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isRole } from "Api/Middleware/isRole";
import { CreateNewProductValidator } from "Api/Modules/Client/Inventory/Validators/Product/CreateNewProductValidator";
import validate from "Api/Validators/Common/validate";
import CreateNewProductController from "Api/Modules/Client/Inventory/Controllers/Merchant/Product/CreateNewProductController";
import ListMerchantProductsController from "Api/Modules/Client/Inventory/Controllers/Merchant/Product/ListMerchantProductsController";
import { MERCHANT_ROLE_NAME } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import FetchProductByIdentifierController from "Api/Modules/Client/Inventory/Controllers/Merchant/Product/FetchProductByIdentifierController";
import UpdateProductController from "Api/Modules/Client/Inventory/Controllers/Merchant/Product/UpdateProductController";
import { UpdateProductValidator } from "Api/Modules/Client/Inventory/Validators/Product/UpdateProductValidator";
import { FetchProductByIdentifierValidator } from "Api/Modules/Client/Inventory/Validators/Product/FetchProductByIdentifierValidator";
import { DeleteProductByIdentifierValidator } from "Api/Modules/Client/Inventory/Validators/Product/DeleteProductByIdentifierValidator";
import DeleteProductController from "Api/Modules/Client/Inventory/Controllers/Merchant/Product/DeleteProductController";
import ListMerchantCollectionsController from "Api/Modules/Client/Inventory/Controllers/Merchant/Collections/ListMerchantCollectionsController";

const routes = Router();

// Product Routes
routes.post(
  "/Create/Product",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  CreateNewProductValidator,
  validate,
  CreateNewProductController.handle
);

routes.get(
  "/Fetch/MerchantProducts/",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  ListMerchantProductsController.handle
);

routes.get(
  "/Fetch/MerchantProduct/:productIdentifier",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  FetchProductByIdentifierValidator,
  FetchProductByIdentifierController.handle
);

routes.patch(
  "/Update/MerchantProduct/:productIdentifier",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  UpdateProductValidator,
  validate,
  UpdateProductController.handle
);

routes.delete(
  "/Delete/MerchantProduct/:productIdentifier",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  DeleteProductByIdentifierValidator,
  validate,
  DeleteProductController.handle
);

// Collection Routes
routes.get(
  "/Fetch/MerchantCollections",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  ListMerchantCollectionsController.handle
);
export default routes;
