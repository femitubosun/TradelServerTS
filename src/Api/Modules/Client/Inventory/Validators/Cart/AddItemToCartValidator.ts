import { body } from "express-validator";

export const AddItemToCartValidator = [
  body(
    "product_variant_identifier",
    "Product Variant Identifier should be a valid UUID"
  )
    .optional()
    .trim()
    .escape()
    .isUUID(),

  body("product_identifier", "Product identifier should be a valid UUID"),
  body("is_product", "Is Product is compulsory")
    .isBoolean()
    .withMessage("Is Product Should be a boolean field"),
  body("quantity", "Quantity should be a valid integer").isInt(),
];
