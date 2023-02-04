export interface UpdateUserRecordDTO {
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
