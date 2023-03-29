import { body } from "express-validator";

export const RemoveMerchantProductVariantOptionValidator = [
  body("variant_label", "Variant Label should be a string")
    .isString()
    .trim()
    .escape(),
];
