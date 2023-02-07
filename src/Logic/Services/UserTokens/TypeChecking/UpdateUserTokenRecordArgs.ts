type UpdateUserTokenPayload = {
  expired?: boolean;
  token?: string;
  user?: string;
};

export type UpdateUserTokenRecordArgs = {
  identifier: "id" | "identifier";
  updatePayload: UpdateUserTokenPayload;
};
