import { UserTokenTypesEnum } from "Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/UserTokens/UserTokenTypesEnum";

export type FetchActiveUserTokenRecordDtoType = {
  userId: number;
  tokenType: UserTokenTypesEnum;
};
