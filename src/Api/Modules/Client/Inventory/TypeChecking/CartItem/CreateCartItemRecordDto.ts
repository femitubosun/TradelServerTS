import { ICartItem } from "Api/Modules/Client/Inventory/TypeChecking/CartItem/ICartItem";
import QueryRunner from "TypeChecking/QueryRunner";

export type CreateCartItemRecordDto = Pick<
  ICartItem,
  | "cart"
  | "productVariant"
  | "productVariantId"
  | "product"
  | "productId"
  | "isProduct"
  | "quantity"
> &
  QueryRunner;
