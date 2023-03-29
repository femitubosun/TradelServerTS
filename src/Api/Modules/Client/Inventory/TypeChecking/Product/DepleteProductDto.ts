import DbQueryRunner from "TypeChecking/QueryRunner";

export type DepleteProductDto = {
  productId: number;

  quantity: number;
} & DbQueryRunner;
