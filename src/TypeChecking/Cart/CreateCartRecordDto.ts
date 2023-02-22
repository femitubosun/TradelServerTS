import { QueryRunner } from "typeorm";
import { Customer } from "Entities/Customer";

export type CreateCartRecordDto = {
  customer: Customer;
  queryRunner: QueryRunner;
};
