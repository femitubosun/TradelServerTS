import { IProduct } from "Api/Modules/Client/Inventory/TypeChecking/Product/IProduct";
import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateProductRecordDtoType = Pick<
  IProduct,
  "name" | "description" | "basePrice" | "merchantId"
> &
  DbQueryRunner;
