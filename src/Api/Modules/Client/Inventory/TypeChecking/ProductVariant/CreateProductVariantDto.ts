import { IProductVariant } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariant/IProductVariant";
import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateProductVariantDto = Pick<
  IProductVariant,
  "sku" | "price" | "product" | "stock" | "parentVariants"
> &
  DbQueryRunner;
