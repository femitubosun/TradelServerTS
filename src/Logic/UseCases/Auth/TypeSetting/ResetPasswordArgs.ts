import DbQueryRunner from "Logic/Services/TypeChecking/QueryRunner";

export type ResetPasswordArgs = {
  password: string;
  passwordResetToken: string;
} & DbQueryRunner;
