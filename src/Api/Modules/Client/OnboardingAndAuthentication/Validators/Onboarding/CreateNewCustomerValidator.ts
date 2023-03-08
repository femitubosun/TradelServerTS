import { body } from "express-validator";

export const CreateNewCustomerValidator = [
  body("email", "Email Should be an email").isEmail().trim().escape(),
  body("password", "Password required")
    .isLength({
      min: 1,
    })
    .trim()
    .escape(),
  body("first_name", "First Name required")
    .isLength({
      min: 2,
    })
    .trim()
    .escape(),
  body("last_name", "Last Name required")
    .isLength({
      min: 2,
    })
    .trim()
    .escape(),
  body("phone_number", "Phone number required")
    .isLength({
      min: 10,
    })
    .trim()
    .escape(),
];
