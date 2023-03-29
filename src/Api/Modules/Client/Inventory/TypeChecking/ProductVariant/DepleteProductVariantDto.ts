import DbQueryRunner from "TypeChecking/QueryRunner";

export type DepleteProductVariantDto = {
  productVariantId: number;

  quantity: number;
} & DbQueryRunner;
