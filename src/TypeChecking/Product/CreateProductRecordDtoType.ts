import { IProduct } from "TypeChecking/Product/IProduct";
import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateProductRecordDtoType = Pick<
  IProduct,
  "name" | "description" | "basePrice" | "merchantId"
> &
  DbQueryRunner;
