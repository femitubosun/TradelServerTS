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
import { AccessCollectionResourceByIdentifierValidator } from "Api/Modules/Client/Inventory/Validators/Collection/AccessCollectionResourceByIdentifierValidator";
import FetchMerchantCollectionByIdentifier from "Api/Modules/Client/Inventory/Controllers/Merchant/Collections/FetchMerchantCollectionByIdentifierController";
import DeleteMerchantCollectionController from "Api/Modules/Client/Inventory/Controllers/Merchant/Collections/DeleteMerchantCollectionController";
import UpdateMerchantCollectionController from "Api/Modules/Client/Inventory/Controllers/Merchant/Collections/UpdateMerchantCollectionController";
import { UpdateCollectionValidator } from "Api/Modules/Client/Inventory/Validators/Collection/UpdateCollectionValidator";
import { AddProductToCollectionValidator } from "Api/Modules/Client/Inventory/Validators/Collection/AddProductToCollectionValidator";
import AddProductToMerchantCollectionController from "Api/Modules/Client/Inventory/Controllers/Merchant/Collections/AddProductToMerchantCollectionController";
import RemoveProductFromMerchantCollectionController from "Api/Modules/Client/Inventory/Controllers/Merchant/Collections/RemoveProductFromMerchantCollectionController";

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
  "/Fetch/MerchantProducts/:productIdentifier",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  FetchProductByIdentifierValidator,
  FetchProductByIdentifierController.handle
);

routes.patch(
  "/Update/MerchantProducts/:productIdentifier",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  UpdateProductValidator,
  validate,
  UpdateProductController.handle
);

routes.delete(
  "/Delete/MerchantProducts/:productIdentifier",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  DeleteProductByIdentifierValidator,
  validate,
  DeleteProductController.handle
);

// Collection Routes

routes.post(
  "/Create/MerchantCollection",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  CreateNewProductValidator,
  validate,
  CreateNewProductController.handle
);

routes.get(
  "/Fetch/MerchantCollections",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  ListMerchantCollectionsController.handle
);

routes.get(
  "/Fetch/MerchantCollections/:collectionIdentifier",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  AccessCollectionResourceByIdentifierValidator,
  validate,
  FetchMerchantCollectionByIdentifier.handle
);

routes.patch(
  "/Update/MerchantCollections/:collectionIdentifier",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  UpdateCollectionValidator,
  validate,
  UpdateMerchantCollectionController.handle
);

routes.delete(
  "/Delete/MerchantCollection/:collectionIdentifier",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  AccessCollectionResourceByIdentifierValidator,
  validate,
  DeleteMerchantCollectionController.handle
);

routes.post(
  "/Process/AddProductToMerchantCollection/:collectionIdentifier",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  AddProductToCollectionValidator,
  validate,
  AddProductToMerchantCollectionController.handle
);

routes.post(
  "/Process/RemoveProductFromMerchantCollection/:collectionIdentifier",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  AddProductToCollectionValidator,
  validate,
  RemoveProductFromMerchantCollectionController.handle
);
export default routes;
