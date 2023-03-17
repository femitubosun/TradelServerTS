import { param } from "express-validator";

export const DeleteProductByIdentifierValidator = [
  param("productIdentifier", "Identifier must be a valid UUID").isUUID(),
];
