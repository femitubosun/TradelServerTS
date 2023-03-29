import { ISalesOrderItem } from "Api/Modules/Client/Order/TypeChecking/SalesOrderItem/ISalesOrderItem";
import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateSalesOrderItemDto = Pick<
  ISalesOrderItem,
  "order" | "productVariantId" | "productId" | "cost" | "quantity"
> &
  DbQueryRunner;
