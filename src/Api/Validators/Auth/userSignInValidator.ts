import { body } from "express-validator";

const userSignInValidator = [
  body("email", "Email Should be an email").isEmail().trim().escape(),
  body("password", "Password required")
    .isLength({
      min: 1,
    })
    .trim()
    .escape(),
];

export default userSignInValidator;
