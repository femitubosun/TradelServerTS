import { ICartItem } from "Api/Modules/Client/Inventory/TypeChecking/CartItem/ICartItem";
import DbQueryRunner from "TypeChecking/QueryRunner";

type UpdateCartItemPayload = Pick<ICartItem, "quantity">;

export type UpdateCartItemRecordDto = {
  identifier: number | string;
  identifierType: "id" | "identifier";
  updatePayload: UpdateCartItemPayload;
} & DbQueryRunner;
