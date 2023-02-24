import { QueryRunner } from "typeorm";

export type CreateCustomerUseCaseDtoType = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  queryRunner: QueryRunner;
};
