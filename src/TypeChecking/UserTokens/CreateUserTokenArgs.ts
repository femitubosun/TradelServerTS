import { DateTime } from "luxon";
import DbQueryRunner from "TypeChecking/QueryRunner";
import { UserTokenTypesEnum } from "TypeChecking/UserTokens/UserTokenTypesEnum";

export type CreateUserTokenArgs = {
  userId: number;
  tokenType: UserTokenTypesEnum;
  expiresOn: DateTime;
} & DbQueryRunner;
