import DbQueryRunner from "TypeChecking/QueryRunner";
import { IPurchaseOrder } from "Api/Modules/Client/Order/TypeChecking/PurchaseOrder/IPurchaseOrder";

export type CreatePurchaseOrderDto = Pick<
  IPurchaseOrder,
  "customerId" | "items"
> &
  DbQueryRunner;
