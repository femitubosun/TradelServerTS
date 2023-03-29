import { param } from "express-validator";

export const MerchantIdentifierIsValidUuidValidator = [
  param("merchantIdentifier", "Merchant Identifier must be a valid UUID")
    .trim()
    .escape()
    .isUUID(),
];
