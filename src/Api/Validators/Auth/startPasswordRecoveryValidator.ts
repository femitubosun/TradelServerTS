import { body } from "express-validator";

const startPasswordRecoveryValidator = [
  body("email", "Email should be an email").isEmail().trim().escape(),
];

export default startPasswordRecoveryValidator;
