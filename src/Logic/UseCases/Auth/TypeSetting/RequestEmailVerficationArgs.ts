import DbQueryRunner from "Logic/Services/TypeChecking/QueryRunner";

export type RequestEmailVerificationTokenArgs = {
  userId: number;
} & DbQueryRunner;
