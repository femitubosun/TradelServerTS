import { body } from "express-validator";

const requestPasswordResetLinkValidator = [
  body("email", "Email should be an email").isEmail().trim().escape(),
];

export default requestPasswordResetLinkValidator;
