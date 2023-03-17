import { QueryRunner } from "typeorm";

export type CreateCartRecordDto = {
  customerId: number;
  queryRunner: QueryRunner;
};
