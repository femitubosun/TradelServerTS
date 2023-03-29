import { body } from "express-validator";

export const PayForOrderValidator = [
  body("order_identifier", "Order Identifier should be a valid UUID").isUUID(),
];
