import DbQueryRunner from "Logic/Services/TypeChecking/QueryRunner";

export type CreateEmailActivationTokenArgs = {
  userId: number;
} & DbQueryRunner;
