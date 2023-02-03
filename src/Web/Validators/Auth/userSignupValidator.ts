import { body } from "express-validator";

const userSignupValidator = [
  body("email", "Email should be an email").isEmail(),

  body("first_name", "First name should be at least 3 characters").isLength({
    min: 3,
  }),
  body("last_name", "First name should be at least 3 characters").isLength({
    min: 3,
  }),
  body("password").isLength({ min: 7 }),
];

export default userSignupValidator;
