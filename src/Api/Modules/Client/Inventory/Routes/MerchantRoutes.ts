import { Router } from "express";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isRole } from "Api/Middleware/isRole";
import SettingsUserRoleService from "Api/Modules/Client/OnboardingAndAuthentication/Services/SettingsUserRoleService";
import { CreateNewProductValidator } from "Api/Modules/Client/Inventory/Validators/Product/CreateNewProductValidator";
import validate from "Api/Validators/Common/validate";
import CreateNewProductController from "Api/Modules/Client/Inventory/Controllers/Merchant/Product/CreateNewProductController";

import ListMerchantProductsController from "Api/Modules/Client/Inventory/Controllers/Merchant/Product/ListMerchantProductsController";

const routes = Router();

routes.post(
  "/Create/Product",
  asyncMiddlewareHandler(
    isRole([SettingsUserRoleService.getMerchantRoleName()])
  ),
  CreateNewProductValidator,
  validate,
  CreateNewProductController.handle
);

routes.get(
  "/Fetch/MerchantProducts/",
  asyncMiddlewareHandler(
    isRole([SettingsUserRoleService.getMerchantRoleName()])
  ),
  ListMerchantProductsController.handle
);

export default routes;
