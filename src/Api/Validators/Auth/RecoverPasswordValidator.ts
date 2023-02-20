import { body } from "express-validator";

const recoverPasswordValidator = [
  body("email", "Email should be an email").isEmail(),
];

export default recoverPasswordValidator;
