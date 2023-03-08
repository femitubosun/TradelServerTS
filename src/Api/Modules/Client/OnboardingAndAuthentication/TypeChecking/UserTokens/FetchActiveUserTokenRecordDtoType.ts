import { UserTokenTypesEnum } from "TypeChecking/UserTokens/UserTokenTypesEnum";

export type FetchActiveUserTokenRecordDtoType = {
  userId: number;
  tokenType: UserTokenTypesEnum;
};
