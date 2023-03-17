import { param } from "express-validator";

export const FetchProductByIdentifierValidator = [
  param("productIdentifier", "Identifier must be a valid UUID").isUUID(),
];
