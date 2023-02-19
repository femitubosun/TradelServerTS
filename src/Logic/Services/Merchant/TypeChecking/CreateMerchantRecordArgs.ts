import { QueryRunner } from "typeorm";
import { User } from "Entities/User";
import DbQueryRunner from "Logic/Services/TypeChecking/QueryRunner";

export type CreateMerchantRecordArgs = {
  user: User;
  phoneNumber: string;
  storeName: string;
} & DbQueryRunner;
