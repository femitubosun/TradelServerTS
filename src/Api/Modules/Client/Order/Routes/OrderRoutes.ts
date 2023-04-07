import { Router } from "express";
import CreateNewOrderController from "Api/Modules/Client/Order/Controllers/Customer/CreateNewOrderController";
import validate from "Api/Validators/Common/validate";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isRole } from "Api/Middleware/isRole";
import {
  CUSTOMER_ROLE_NAME,
  MERCHANT_ROLE_NAME,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import ListPurchaseOrdersController from "Api/Modules/Client/Order/Controllers/Customer/ListPurchaseOrdersController";
import PayOrderController from "Api/Modules/Client/Order/Controllers/Customer/PayOrderController";
import { PayForOrderValidator } from "Api/Modules/Client/Order/Validators/PayForOrderValidator";
import ListSaleOrderController from "Api/Modules/Client/Order/Controllers/Merchant/ListSaleOrderController";
import FetchSaleOrderByIdentifierController from "Api/Modules/Client/Order/Controllers/Merchant/FetchSaleOrderByIdentifierController";
import { AccessSalesOrderIdentifierValidator } from "Api/Modules/Client/Order/Validators/AccessSalesOrderIdentifierValidator";

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

/*--------------------------------<  Sales Order  >----------------------------- */
routes.get(
  "/Fetch/SalesOrders",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  ListSaleOrderController.handle
);

routes.get(
  "/Fetch/SalesOrders/:salesOrderIdentifier",
  asyncMiddlewareHandler(isRole([MERCHANT_ROLE_NAME])),
  AccessSalesOrderIdentifierValidator,
  FetchSaleOrderByIdentifierController.handle
);

export default routes;
