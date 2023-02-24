import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateMerchantRecordArgs = {
  userId: number;
  phoneNumber: string;
  storeName: string;
} & DbQueryRunner;
