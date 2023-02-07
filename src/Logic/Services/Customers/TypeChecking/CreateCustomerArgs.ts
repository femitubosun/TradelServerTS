import { QueryRunner } from "typeorm";
import { Users } from "Entities/Users";

export class CreateCustomerArgs {
  user: Users;
  queryRunner: QueryRunner;
}
