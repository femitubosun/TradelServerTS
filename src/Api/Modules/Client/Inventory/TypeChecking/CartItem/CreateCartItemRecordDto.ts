import { ICartItem } from "Api/Modules/Client/Inventory/TypeChecking/CartItem/ICartItem";
import QueryRunner from "TypeChecking/QueryRunner";

export type CreateCartItemRecordDto = Pick<
  ICartItem,
  "cartId" | "productId" | "quantity"
> &
  QueryRunner;
