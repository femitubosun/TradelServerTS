import DbQueryRunner from "TypeChecking/QueryRunner";

export type ResetPasswordArgs = {
  password: string;
  passwordResetToken: string;
} & DbQueryRunner;
