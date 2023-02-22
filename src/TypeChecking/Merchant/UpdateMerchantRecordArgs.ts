type UpdateMerchantRecordArgsPayload = {
  phoneNumber?: string;
  storeName?: string;
};

export type UpdateMerchantRecordArgs = {
  identifierType: "id" | "identifierValue";
  identifierValue: string | number;
  updatePayload: UpdateMerchantRecordArgsPayload;
};
