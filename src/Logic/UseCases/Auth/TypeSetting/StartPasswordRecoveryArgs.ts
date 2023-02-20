import DbQueryRunner from "Logic/Services/TypeChecking/QueryRunner";

export type StartPasswordRecoveryArgs = {
  userEmail: string;
} & DbQueryRunner;
