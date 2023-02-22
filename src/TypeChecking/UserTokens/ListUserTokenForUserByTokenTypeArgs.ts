import { UserTokenTypesEnum } from "TypeChecking/UserTokens/UserTokenTypesEnum";

export type ListUserTokenForUserByTokenTypeArgs = {
  userId: number;
  tokenType: UserTokenTypesEnum;
};
