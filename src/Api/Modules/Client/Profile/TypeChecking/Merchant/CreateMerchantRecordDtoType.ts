import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateMerchantRecordDtoType = {
  userId: number;
  phoneNumber: string;
  storeName: string;
} & DbQueryRunner;
