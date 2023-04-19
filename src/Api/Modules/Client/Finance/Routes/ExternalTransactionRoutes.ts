import { Router } from "express";
import { asyncMiddlewareHandler } from "Utils/asyncMiddlewareHandler";
import { isAuthenticated } from "Api/Middleware/isAuthenticated";
import VerifyTransactionController from "Api/Modules/Client/Finance/Controllers/ExternalTransaction/VerifyTransactionController";

const routes = Router();

routes.get(
  "/Process/VerifyTransaction/:transactionReference",
  asyncMiddlewareHandler(isAuthenticated),
  VerifyTransactionController.handle
);

export default routes;
