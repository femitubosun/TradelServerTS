import { UserTokenTypesEnum } from "Entities/UserTokens";

export type ListUserTokenForUserByTokenTypeArgs = {
  userId: number;
  tokenType: UserTokenTypesEnum;
};
