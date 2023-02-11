import { QueryRunner } from "typeorm";
import { User } from "Entities/User";

export class CreateCustomerArgs {
  user: User;
  phoneNumber: string;
  queryRunner: QueryRunner;
}
