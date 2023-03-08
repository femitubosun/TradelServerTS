import { body } from "express-validator";

export const EmailSignInValidator = [
  body("email", "Email Should be an email").isEmail().trim().escape(),
  body("password", "Password required")
    .isLength({
      min: 1,
    })
    .trim()
    .escape(),
];
