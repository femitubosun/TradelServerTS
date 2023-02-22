type UpdateUserTokenPayload = {
  expired?: boolean;
  token?: string;
  user?: string;
};

export type UpdateUserTokenRecordArgs = {
  identifierType: "id" | "identifier";
  identifier: number | string;
  updatePayload: UpdateUserTokenPayload;
};
