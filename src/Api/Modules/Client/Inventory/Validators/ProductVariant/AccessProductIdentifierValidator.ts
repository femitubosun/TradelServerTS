import { param } from "express-validator";

export const AccessProductIdentifierValidator = [
  param(
    "productIdentifier",
    "Product Identifier should be a valid UUID"
  ).isUUID(),
];
