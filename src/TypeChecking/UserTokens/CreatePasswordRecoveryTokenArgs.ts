import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreatePasswordRecoveryTokenArgs = {
  userId: number;
  token: string;
} & DbQueryRunner;
