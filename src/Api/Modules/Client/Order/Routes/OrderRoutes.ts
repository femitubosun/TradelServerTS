import { Router } from "express";
import CreateNewOrderController from "Api/Modules/Client/Order/Controllers/Customer/CreateNewOrderController";
import validate from "Api/Validators/Common/validate";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isRole } from "Api/Middleware/isRole";
import { CUSTOMER_ROLE_NAME } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import ListPurchaseOrdersController from "Api/Modules/Client/Order/Controllers/Customer/ListPurchaseOrdersController";
import PayOrderController from "Api/Modules/Client/Order/Controllers/Customer/PayOrderController";
import { PayForOrderValidator } from "Api/Modules/Client/Order/Validators/PayForOrderValidator";

const routes = Router();

/*-------------------------------<  Purchase Order  >--------------------------- */

routes.post(
  "/Process/CreateOrderFromCart",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  CreateNewOrderController.handle
);

routes.get(
  "/Fetch/PurchaseOrders",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  ListPurchaseOrdersController.handle
);

routes.post(
  "/Process/PayForOrder",
  asyncMiddlewareHandler(isRole([CUSTOMER_ROLE_NAME])),
  PayForOrderValidator,
  validate,
  PayOrderController.handle
);

export default routes;
