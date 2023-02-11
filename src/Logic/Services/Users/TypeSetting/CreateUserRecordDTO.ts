import { ISettingsUserRole } from "Logic/Services/SettingsUserRole/TypeChecking";
import { QueryRunner } from "typeorm";
import { SettingsUserRoles } from "Entities/SettingsUserRoles";

export type CreateUserRecordArgs = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: SettingsUserRoles;
  queryRunner: QueryRunner;
};
