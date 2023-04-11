import { body } from "express-validator";

export const CreateNewProductValidator = [
  body("name", "Name should be a string")
    .isLength({
      min: 2,
    })
    .trim()
    .escape(),
  body("description", "Description should be a string")
    .optional()
    .isString()
    .escape(),
  body("base_price", "Base price should be a numeric value")
    .isNumeric()
    .trim()
    .escape(),
];
