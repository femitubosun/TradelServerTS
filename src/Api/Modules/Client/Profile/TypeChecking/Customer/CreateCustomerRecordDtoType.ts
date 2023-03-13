import { QueryRunner } from "typeorm";

export type CreateCustomerRecordDtoType = {
  userId: number;
  phoneNumber: string;
  queryRunner: QueryRunner;
};
