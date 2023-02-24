import DbQueryRunner from "TypeChecking/QueryRunner";

export type StartPasswordRecoveryDtoType = {
  userEmail: string;
} & DbQueryRunner;
