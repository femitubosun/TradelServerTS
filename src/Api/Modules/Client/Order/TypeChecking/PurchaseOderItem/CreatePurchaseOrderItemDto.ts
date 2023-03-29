import DbQueryRunner from "TypeChecking/QueryRunner";
import { IPurchaseOrderItem } from "Api/Modules/Client/Order/TypeChecking/PurchaseOderItem/IPurchaseOrderItem";

export type CreatePurchaseOrderItemDto = Pick<
  IPurchaseOrderItem,
  "order" | "productVariantId" | "productId" | "cost" | "quantity" | "isProduct"
> &
  DbQueryRunner;
