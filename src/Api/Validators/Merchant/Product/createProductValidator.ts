import { body } from "express-validator";

export const createProductValidator = [
  body("name", "Name should be a string")
    .isString()
    .isLength({
      min: 1,
    })
    .trim()
    .escape(),

  body("description", "Description should be a string")
    .isLength({
      min: 10,
    })
    .trim()
    .escape(),

  body("base_price").isNumeric(),
];
