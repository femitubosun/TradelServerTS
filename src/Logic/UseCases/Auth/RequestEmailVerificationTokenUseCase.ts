import { User } from "Entities/User";
import UserTokensService from "Logic/Services/UserTokens/UserTokensService";
import { UserTokenTypesEnum } from "Entities/UserTokens";

export class RequestEmailVerificationTokenUseCase {
  public static async execute(user: User) {
    const userTokens = await UserTokensService.listUserTokenForUserByTokenType({
      userId: user.id,
      tokenType: UserTokenTypesEnum.EMAIL,
    });

    if (userTokens) {
      for (let token of userTokens) {
        await UserTokensService.deactivateUserToken(token.id);
      }
    }
    const token = await UserTokensService.createEmailActivationToken(user.id);
  }
}
