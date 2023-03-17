import DbQueryRunner from "TypeChecking/QueryRunner";

export type DeleteProductRecordDto = {
  identifier: string | number;
  identifierType: "id" | "identifier";
} & DbQueryRunner;
