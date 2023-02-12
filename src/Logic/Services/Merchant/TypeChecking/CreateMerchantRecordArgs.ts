import { QueryRunner } from "typeorm";
import { User } from "Entities/User";

export type CreateMerchantRecordArgs = {
  user: User;
  phoneNumber: string;
  storeName: string;
  queryRunner: QueryRunner;
};
