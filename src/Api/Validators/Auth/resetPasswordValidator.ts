import { param, body } from "express-validator";
import { businessConfig } from "Config/businessConfig";

const resetPasswordValidator = [
  param("passwordResetToken")
    .isLength({
      min: businessConfig.emailTokenLength,
      max: businessConfig.emailTokenLength,
    })
    .trim()
    .escape(),

  body("password")
    .isLength({
      min: 8,
    })
    .trim()
    .escape(),
];

export default resetPasswordValidator;
