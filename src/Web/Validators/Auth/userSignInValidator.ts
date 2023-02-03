import { body } from "express-validator";

const userSignInValidator = [
  body("email", "Email Should be an email").isEmail(),
  body("password", "Password required").isLength({
    min: 1,
  }),
];

export default userSignInValidator;
