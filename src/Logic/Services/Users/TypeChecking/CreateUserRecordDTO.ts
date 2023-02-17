import { SettingsUserRoles } from "Entities/SettingsUserRoles";
import DbQueryRunner from "Logic/Services/TypeChecking/QueryRunner";

export type CreateUserRecordArgs = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: SettingsUserRoles;
} & DbQueryRunner;
