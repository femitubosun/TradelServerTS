import { SettingsUserRoles } from "Domain/Entities/SettingsUserRoles";
import { ObjectLiteral } from "typeorm";

export interface IUser {
  id: number;
  identifier: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isFirstTimeLogin: boolean;
  hasVerifiedEmail: boolean;
  lastLoginDate: Date;
  role: any;
  roleId: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserOptions = Pick<
  IUser,
  "email" | "firstName" | "lastName" | "password" | "role"
>;

export interface UpdateUserRecordOptions {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  isFirstTimeLogin?: boolean;
  hasVerifiedEmail?: boolean;
  lastLoginDate?: Date;
  role: any;
  isActive?: boolean;
  isDeleted?: boolean;
}
