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
