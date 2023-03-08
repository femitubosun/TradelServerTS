import { body } from "express-validator";
import { businessConfig } from "Config/businessConfig";

export const VerifyEmailValidator = [
  body("otp_token", "Otp Token is required")
    .isLength({
      min: businessConfig.emailTokenLength,
      max: businessConfig.emailTokenLength,
    })
    .trim()
    .escape(),
];
