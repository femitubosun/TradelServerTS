type UpdateUserTokenPayload = {
  expired?: boolean;
  isActive?: boolean;
  token?: string;
  user?: string;
};

export type UpdateUserTokenRecordDtoType = {
  identifierType: "id" | "identifier";
  identifier: number | string;
  updatePayload: UpdateUserTokenPayload;
};
