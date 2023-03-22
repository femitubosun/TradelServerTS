import { body, param } from "express-validator";

export const CreateNewProductVariantOptionValidator = [
  // param(
  //   "productIdentifier",
  //   "Product Identifier should be a valid UUID"
  // ).isUUID(),
  body("variant_label", "Variant Label should be a string")
    .isString()
    .isLength({
      min: 2,
      max: 15,
    })
    .withMessage(
      "Variant Label must be greater than two characters and less than 15 characters"
    )
    .trim()
    .escape(),
  body("variant_options", "Variant Options should be an array of string")
    .isArray()
    .custom((array) => {
      return array.every((member: unknown) => {
        return typeof member === "string";
      });
    }),
];
