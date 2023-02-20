import { param, body } from "express-validator";
import { businessConfig } from "Config/businessConfig";

export const resetPasswordValidator = [
  param("passwordResetToken").isLength({
    min: businessConfig.userTokenLength,
    max: businessConfig.userTokenLength,
  }),

  body("password").isLength({
    min: 8,
  }),
];
