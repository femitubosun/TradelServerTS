import DbQueryRunner from "TypeChecking/QueryRunner";

export type DeleteRecordDto = {
  identifier: string | number;
  identifierType: "id" | "identifier";
} & DbQueryRunner;
