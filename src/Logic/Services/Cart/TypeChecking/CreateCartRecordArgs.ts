import { QueryRunner } from "typeorm";
import { Customer } from "Entities/Customer";

export type CreateCartRecordArgs = {
  customer: Customer;
  queryRunner: QueryRunner;
};
