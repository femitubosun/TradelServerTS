import { Router } from "express";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isRole } from "Api/Middleware/isRole";
import { CUSTOMER_ROLE_NAME } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import ListActiveMerchantsController from "Api/Modules/Client/Profile/Controllers/Customer/Merchant/ListActiveMerchantsController";
import { MerchantIdentifierIsValidUuidValidator } from "Api/Modules/Client/Inventory/Validators/Product/MerchantIdentifierIsValidUuidValidator";
import validate from "Api/Validators/Common/validate";
import FetchMerchantByIdentifierController from "Api/Modules/Client/Profile/Controllers/Customer/Merchant/FetchMerchantByIdentifierController";
import ListActiveProductsByMerchantController from "Api/Modules/Client/Inventory/Controllers/Customer/Product/ListActiveProductsByMerchantController";
import SearchMerchantByNameController from "Api/Modules/Client/Profile/Controllers/Customer/Merchant/SearchMerchantByNameController";

const routes = Router();

/*------------------------------<  Merchants Routes  >-------------------------- */

routes.get(
  "/Fetch/Merchants",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  ListActiveMerchantsController.handle
);

routes.get(
  "/Fetch/Merchants/:merchantIdentifier",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  MerchantIdentifierIsValidUuidValidator,
  validate,
  FetchMerchantByIdentifierController.handle
);

routes.get(
  "/Fetch/Merchants/:merchantIdentifier/Products",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  MerchantIdentifierIsValidUuidValidator,
  validate,
  ListActiveProductsByMerchantController.handle
);

routes.get(
  "/Process/SearchMerchants/",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  SearchMerchantByNameController.handle
);

export default routes;
