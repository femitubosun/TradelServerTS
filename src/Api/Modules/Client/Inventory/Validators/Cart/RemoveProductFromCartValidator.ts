import { body } from "express-validator";

export const RemoveProductFromCartValidator = [
  body(
    "product_identifier",
    "Product Identifier should be a valid UUID"
  ).isUUID(),
];
