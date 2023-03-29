import { param } from "express-validator";

export const AccessProductVariantIdentifierValidator = [
  param(
    "productVariantIdentifier",
    "Product Variant Identifier should be a valid UUID"
  ).isUUID(),
];
