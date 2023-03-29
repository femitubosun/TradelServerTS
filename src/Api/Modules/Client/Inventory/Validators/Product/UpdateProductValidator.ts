import { body, param } from "express-validator";

export const UpdateProductValidator = [
  body("name", "Name is required")
    .isString()
    .optional()
    .withMessage("Name should be a string")
    .escape()
    .trim(),

  body("description", "Description is required")
    .isString()
    .optional()
    .withMessage("Description should be a string")
    .escape()
    .trim(),

  body("base_price", "Base Price is required")
    .isFloat()
    .optional()
    .withMessage("Base Price should be float"),
];
