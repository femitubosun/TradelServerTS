import { body } from "express-validator";

export const RequestPasswordResetLinkValidator = [
  body("email", "Email should be an email").isEmail().trim().escape(),
];
