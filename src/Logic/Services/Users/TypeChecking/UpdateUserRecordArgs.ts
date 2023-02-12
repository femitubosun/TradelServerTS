type UpdateUserRecordArgsPayload = {
  email?: string;
  isFirstTimeLogin?: boolean;
  hasVerifiedEmail?: boolean;
  lastLoginDate?: Date;
  role?: any;
  isActive?: boolean;
  isDeleted?: boolean;
  firstName?: string;
  lastName?: string;
  password?: string;
};

export type UpdateUserRecordArgs = {
  identifierType: "id" | "identifier";
  identifier: number | string;
  updateUserRecordPayload: UpdateUserRecordArgsPayload;
};
