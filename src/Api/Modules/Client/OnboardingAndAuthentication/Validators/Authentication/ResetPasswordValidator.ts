import { param, body } from "express-validator";
import { businessConfig } from "Config/businessConfig";

export const ResetPasswordValidator = [
  param("passwordResetToken", "Invalid Link")
    .isLength({
      min: businessConfig.passwordResetTokenLength,
      max: businessConfig.passwordResetTokenLength,
    })
    .trim()
    .escape(),

  body("password", "Password is required")
    .isLength({
      min: 8,
    })
    .trim()
    .escape(),
];
