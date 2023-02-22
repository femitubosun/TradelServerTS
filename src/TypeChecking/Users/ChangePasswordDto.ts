import DbQueryRunner from "TypeChecking/QueryRunner";

export type ChangePasswordDto = {
  identifierType: "id" | "identifier";
  identifier: number | string;
  password: string;
} & DbQueryRunner;
