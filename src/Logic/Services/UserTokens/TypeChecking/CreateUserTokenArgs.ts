import { User } from "Entities/User";
import { UserTokenTypesEnum } from "Entities/UserTokens";
import { QueryRunner } from "typeorm";

export type CreateUserTokenArgs = {
  user: User;
  type: UserTokenTypesEnum;
};
