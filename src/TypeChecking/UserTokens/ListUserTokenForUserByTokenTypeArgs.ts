import { UserTokenTypesEnum } from "TypeChecking/UserTokens";

export type ListUserTokenForUserByTokenTypeArgs = {
  userId: number;
  tokenType: UserTokenTypesEnum;
};
