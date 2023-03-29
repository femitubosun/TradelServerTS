import { body } from "express-validator";

export const CreateNewOrderValidator = [
  body("cart_identifier", "Cart Identifier should be a valid UUID").isUUID(),
];
