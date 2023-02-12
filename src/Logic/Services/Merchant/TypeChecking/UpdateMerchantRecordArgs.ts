type UpdateMerchantRecordArgsPayload = {
  phoneNumber?: string;
  storeName?: string;
};

export type UpdateMerchantRecordArgs = {
  identifierType: "id" | "identifier";
  identifier: string | number;
  updatePayload: UpdateMerchantRecordArgsPayload;
};
