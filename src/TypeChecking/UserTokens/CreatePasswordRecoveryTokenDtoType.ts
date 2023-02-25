import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreatePasswordRecoveryTokenDtoType = {
  userId: number;
  token: string;
} & DbQueryRunner;
