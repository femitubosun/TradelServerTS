import { DateTime } from "luxon";

export interface ICartItem {
  id: number;

  identifier: string;

  cartId: number;

  productId: number;

  quantity: number;

  createdAt: DateTime;

  updatedAt: DateTime;
}
