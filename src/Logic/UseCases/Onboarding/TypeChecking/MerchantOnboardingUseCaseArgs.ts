import { QueryRunner } from "typeorm";

export type MerchantOnboardingUseCaseArgs = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  storeName: string;
  queryRunner: QueryRunner;
};
