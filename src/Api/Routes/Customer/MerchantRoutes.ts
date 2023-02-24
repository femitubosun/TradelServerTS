import { Router } from "express";
import MerchantController from "Api/Controllers/Customer/MerchantController";

const routes = Router();

routes.get("/Fetch/Merchants", MerchantController.listActiveMerchants);

routes.get(
  "/Fetch/Merchant/:merchantIdentifier",
  MerchantController.getActiveMerchantByIdentifier
);
