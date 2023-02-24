import { body } from "express-validator";
import { businessConfig } from "Config/businessConfig";

const emailVerificationValidator = [
  body("otp_token", "Otp Token is required")
    .isLength({
      min: businessConfig.emailTokenLength,
      max: businessConfig.emailTokenLength,
    })
    .trim()
    .escape(),
];

export default emailVerificationValidator;
