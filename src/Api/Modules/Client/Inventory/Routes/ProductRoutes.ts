import { Router } from "express";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isRole } from "Api/Middleware/isRole";
import { CreateNewProductValidator } from "Api/Modules/Client/Inventory/Validators/Product/CreateNewProductValidator";
import validate from "Api/Validators/Common/validate";
import CreateNewProductController from "Api/Modules/Client/Inventory/Controllers/Product/Merchant/CreateNewProductController";
import ListActiveProductsController from "Api/Modules/Client/Inventory/Controllers/Product/ListActiveProductsController";
import SettingsUserRoleService from "Api/Modules/Client/OnboardingAndAuthentication/Services/SettingsUserRoleService";
import { isAuthenticated } from "Api/Middleware/isAuthenticated";
import ListMerchantProductsController from "Api/Modules/Client/Inventory/Controllers/Product/Merchant/ListMerchantProductsController";

const route = Router();

route.post(
  "/Create/Product",
  asyncMiddlewareHandler(
    isRole([SettingsUserRoleService.getMerchantRoleName()])
  ),
  CreateNewProductValidator,
  validate,
  CreateNewProductController.handle
);

route.get(
  "/Fetch/ActiveProducts",
  asyncMiddlewareHandler(isAuthenticated),
  ListActiveProductsController.handle
);

route.get(
  "/Fetch/MerchantProducts/",
  asyncMiddlewareHandler(
    isRole([SettingsUserRoleService.getMerchantRoleName()])
  ),
  ListMerchantProductsController.handle
);

route.get(
  "/Fetch/ActiveProductsByMerchant",
  asyncMiddlewareHandler(isAuthenticated)
);

export default route;
