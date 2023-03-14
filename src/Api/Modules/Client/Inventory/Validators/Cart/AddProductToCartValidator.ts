import { body } from "express-validator";

export const AddProductToCartValidator = [
  body("product_identifier", "Product Identifier should be a valid UUID")
    .trim()
    .escape()
    .isUUID(),
];
