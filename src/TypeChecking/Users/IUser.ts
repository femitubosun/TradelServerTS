import { DateTime } from "luxon";

export interface IUser {
  id: number;

  identifier: string;

  email: string;

  firstName: string;

  lastName: string;

  password: string;

  isFirstTimeLogin: boolean;

  hasVerifiedEmail: boolean;

  lastLoginDate: DateTime;

  roleId: number;

  isActive: boolean;

  isDeleted: boolean;

  createdAt: DateTime;

  updatedAt: DateTime;
}
