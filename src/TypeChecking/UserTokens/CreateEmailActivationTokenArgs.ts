import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateEmailActivationTokenArgs = {
  userId: number;
  token: string;
} & DbQueryRunner;
