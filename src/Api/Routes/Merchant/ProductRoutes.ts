import { Router } from "express";
import CreateProductController from "Api/Controllers/Merchant/Product/CreateNewProductController";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isRole } from "Api/Middleware/isRole";
import SettingsUserRoleService from "Api/Modules/Client/OnboardingAndAuthentication/Services/SettingsUserRoleService";
import { createProductValidator } from "Api/Validators/Merchant/Product/createProductValidator";
import validate from "Api/Validators/Common/validate";

const routes = Router();

// routes.get("/Fetch/Merchants", MerchantController.listActiveMerchants);
//
// routes.get(
//   "/Fetch/Merchant/:merchantIdentifier",
//   MerchantController.getActiveMerchantByIdentifier
// );

// routes.post(
//   "/Create/Product",
//   asyncMiddlewareHandler(
//     isRole([SettingsUserRoleService.getMerchantRoleName()])
//   ),
//   createProductValidator,
//   validate,
//   CreateProductController.createNewProduct
// );

export default routes;
