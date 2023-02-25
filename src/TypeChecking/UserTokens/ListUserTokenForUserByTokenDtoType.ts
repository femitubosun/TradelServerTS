import { UserTokenTypesEnum } from "TypeChecking/UserTokens";

export type ListUserTokenForUserByTokenDtoType = {
  userId: number;
  tokenType: UserTokenTypesEnum;
};
