import { param } from "express-validator";

export const AccessPurchaseOrderIdentifierValidator = [
  param(
    "purchaseOrderIdentifier",
    "Purchase Order Identifier must be a valid UUID"
  ).isUUID(),
];
