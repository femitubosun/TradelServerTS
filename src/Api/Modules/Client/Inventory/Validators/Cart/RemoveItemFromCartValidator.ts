import { body } from "express-validator";

export const RemoveItemFromCartValidator = [
  body(
    "cart_item_identifier",
    "Cart Item Identifier must be a valid UUID"
  ).isUUID(),
];
