import { IProductVariantOptions } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariantOption/IProductVariantOptions";
import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateProductVariantOptionRecordDto = Pick<
  IProductVariantOptions,
  "variantOptions" | "productId"
> &
  DbQueryRunner;
