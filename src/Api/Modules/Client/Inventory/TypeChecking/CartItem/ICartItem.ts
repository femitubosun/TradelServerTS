import { DateTime } from "luxon";
import {
  Cart,
  Product,
  ProductVariant,
} from "Api/Modules/Client/Inventory/Entities";

export interface ICartItem {
  id: number;

  identifier: string;

  cart: Cart;

  productVariant?: ProductVariant;

  productVariantId?: number;

  product?: Product;

  productId?: number;

  isProduct?: boolean;

  quantity: number;

  createdAt: DateTime;

  updatedAt: DateTime;
}
