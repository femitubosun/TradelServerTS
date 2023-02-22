import { QueryRunner } from "typeorm";
import { User } from "Entities/User";

export type CreateCustomerArgs = {
  userId: number;
  phoneNumber: string;
  queryRunner: QueryRunner;
};
