import { ISalesOrder } from "Api/Modules/Client/Order/TypeChecking/SalesOrder/ISalesOrder";
import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateSalesOrderDto = Pick<
  ISalesOrder,
  | "customerId"
  | "merchantId"
  | "purchaseOrder"
  | "productVariantId"
  | "productId"
  | "quantity"
  | "cost"
  | "status"
> &
  DbQueryRunner;
