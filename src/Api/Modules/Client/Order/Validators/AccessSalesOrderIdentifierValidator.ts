import { param } from "express-validator";

export const AccessSalesOrderIdentifierValidator = [
  param(
    "salesOrderIdentifier",
    "Sales Order Identifier must be a valid UUID"
  ).isUUID(),
];
