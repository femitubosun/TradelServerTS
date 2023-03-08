import { DateTime } from "luxon";
import DbQueryRunner from "TypeChecking/QueryRunner";
import { UserTokenTypesEnum } from "Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/UserTokens/index";

export type CreateUserTokenDtoType = {
  userId: number;
  token: string;
  tokenType: UserTokenTypesEnum;
  expiresOn: DateTime;
} & DbQueryRunner;
