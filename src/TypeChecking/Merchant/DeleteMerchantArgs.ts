import { UpdateMerchantRecordArgs } from "TypeChecking/Merchant/UpdateMerchantRecordArgs";

export type DeleteMerchantArgs = Pick<
  UpdateMerchantRecordArgs,
  "identifierValue" | "identifierType"
>;
