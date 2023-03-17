import { body } from "express-validator";

export const AddItemToCartValidator = [
  body("product_identifier", "Product Identifier should be a valid UUID")
    .trim()
    .escape()
    .isUUID(),

  body("quantity", "Quantity should be a valid integer").isInt(),
];
