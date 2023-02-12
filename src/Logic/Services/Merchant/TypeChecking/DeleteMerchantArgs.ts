import { UpdateMerchantRecordArgs } from "Logic/Services/Merchant/TypeChecking/UpdateMerchantRecordArgs";

export type DeleteMerchantArgs = Pick<
  UpdateMerchantRecordArgs,
  "identifier" | "identifierType"
>;
