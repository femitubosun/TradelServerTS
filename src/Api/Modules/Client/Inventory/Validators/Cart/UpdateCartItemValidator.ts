import { body, param } from "express-validator";

export const UpdateCartItemValidator = [
  param("cartItemIdentifier", "Identifier must be a valid UUID").isUUID(),
  body("quantity", "Quantity should be an integer").isInt(),
];
