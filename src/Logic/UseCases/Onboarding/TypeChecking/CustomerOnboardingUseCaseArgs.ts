import { QueryRunner } from "typeorm";

export type CustomerOnboardingUseCaseArgs = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  queryRunner: QueryRunner;
};
