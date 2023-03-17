import DbQueryRunner from "TypeChecking/QueryRunner";

type UpdateProductPayload = {
  name?: string;

  description?: string;

  basePrice?: string;
};

export type UpdateProductRecordDto = {
  identifier: string | number;
  identifierType: "id" | "identifier";
  updatePayload: UpdateProductPayload;
} & DbQueryRunner;
