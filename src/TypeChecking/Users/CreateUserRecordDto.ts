import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateUserRecordDto = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: number;
} & DbQueryRunner;
