import { IProductCategory } from "TypeChecking/ProductCategory/IProductCategory";
import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateProductCategoryDtoType = Pick<
  IProductCategory,
  "name" | "photoUrl"
> &
  DbQueryRunner;
