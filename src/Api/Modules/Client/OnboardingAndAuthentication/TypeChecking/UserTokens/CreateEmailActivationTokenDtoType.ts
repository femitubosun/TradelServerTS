import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateEmailActivationTokenDtoType = {
  userId: number;
  token: string;
} & DbQueryRunner;
