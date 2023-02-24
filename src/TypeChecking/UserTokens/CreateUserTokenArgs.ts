import { DateTime } from "luxon";
import DbQueryRunner from "TypeChecking/QueryRunner";
import { UserTokenTypesEnum } from "TypeChecking/UserTokens";

export type CreateUserTokenArgs = {
  userId: number;
  token: string;
  tokenType: UserTokenTypesEnum;
  expiresOn: DateTime;
} & DbQueryRunner;
