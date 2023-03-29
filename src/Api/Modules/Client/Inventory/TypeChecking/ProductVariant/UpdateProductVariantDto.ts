import DbQueryRunner from "TypeChecking/QueryRunner";

type UpdateProductVariantPayload = {
  sku?: string;

  parentVariants?: string[];

  stock?: number;

  price?: number;
};

export type UpdateProductVariantDto = {
  identifier: string | number;

  identifierType: "id" | "identifier";

  updatePayload: UpdateProductVariantPayload;
} & DbQueryRunner;
