import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreatePasswordRecoveryTokenArgs = {
  userId: number;
} & DbQueryRunner;
