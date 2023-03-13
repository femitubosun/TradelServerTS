import { UpdateMerchantRecordArgs } from "Api/Modules/Client/Profile/TypeChecking/Merchant/UpdateMerchantRecordArgs";

export type DeleteMerchantArgs = Pick<
  UpdateMerchantRecordArgs,
  "identifierValue" | "identifierType"
>;
