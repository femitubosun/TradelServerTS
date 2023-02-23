import { body } from "express-validator";
import { businessConfig } from "Config/businessConfig";

const emailVerificationValidator = [
  body("otp_token", "Otp Token is required")
    .isLength({
      min: businessConfig.userTokenLength,
      max: businessConfig.userTokenLength,
    })
    .trim()
    .escape(),
];
