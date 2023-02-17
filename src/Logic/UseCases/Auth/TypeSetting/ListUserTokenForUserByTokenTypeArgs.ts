import { UserTokenTypesEnum } from "Entities/UserTokens";
import { User } from "Entities/User";

export type ListUserTokenForUserByTokenTypeArgs = {
  userId: number;
  tokenType: UserTokenTypesEnum;
};
