import { QueryRunner } from "typeorm";

export type CreateCustomerArgs = {
  userId: number;
  phoneNumber: string;
  queryRunner: QueryRunner;
};
