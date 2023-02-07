import { QueryRunner } from "typeorm";

export type CustomerOnboardingArgs = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  queryRunner: QueryRunner;
};
