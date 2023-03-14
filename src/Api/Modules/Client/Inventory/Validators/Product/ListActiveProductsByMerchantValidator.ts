import { param } from "express-validator";

export const ListActiveProductsByMerchantValidator = [
  param("merchantIdentifier", "Merchant Identifier must be a valid UUID")
    .trim()
    .escape()
    .isUUID(),
];
