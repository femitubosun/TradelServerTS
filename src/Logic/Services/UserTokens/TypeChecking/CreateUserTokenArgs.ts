import { User } from "Entities/User";
import { UserTokenTypesEnum } from "Entities/UserTokens";
import { QueryRunner } from "typeorm";
import { DateTime } from "luxon";

export type CreateUserTokenArgs = {
  user: User;
  type: UserTokenTypesEnum;
  expiresOn: DateTime;
};
