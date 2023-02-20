import DbQueryRunner from "Logic/Services/TypeChecking/QueryRunner";

export type CreatePasswordRecoveryTokenArgs = {
  userId: number;
} & DbQueryRunner;
