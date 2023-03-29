import { body } from "express-validator";

export const UpdateProductVariantValidator = [
  body("parent_variants", "Parent Variants must be an array of string")
    .isArray()
    .optional()
    .custom((array) => {
      return array.every((member: unknown) => {
        return typeof member === "string";
      });
    }),
  body("sku", "Sku must be a valid string")
    .optional()
    .isString()
    .trim()
    .escape(),
  body("price", "Price must be a valid number").optional().isNumeric(),
];
