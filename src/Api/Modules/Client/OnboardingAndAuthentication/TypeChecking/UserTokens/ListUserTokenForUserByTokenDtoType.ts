import { UserTokenTypesEnum } from "Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/UserTokens/index";

export type ListUserTokenForUserByTokenDtoType = {
  userId: number;
  tokenType: UserTokenTypesEnum;
};
