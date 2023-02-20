import DbQueryRunner from "Logic/Services/TypeChecking/QueryRunner";

export type ChangePasswordArgs = {
  identifierType: "id" | "identifier";
  identifier: number | string;
  password: string;
} & DbQueryRunner;
