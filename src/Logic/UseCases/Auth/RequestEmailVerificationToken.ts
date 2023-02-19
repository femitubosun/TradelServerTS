import { User } from "Entities/User";
import UserTokensService from "Logic/Services/UserTokens/UserTokensService";
import { UserTokenTypesEnum } from "Entities/UserTokens";
import { RequestEmailVerificationTokenArgs } from "Logic/UseCases/Auth/TypeSetting/RequestEmailVerficationArgs";

export class RequestEmailVerificationToken {
  public static async execute(
    requestEmailVerificationTokenArgs: RequestEmailVerificationTokenArgs
  ) {
    const { userId, queryRunner } = requestEmailVerificationTokenArgs;
    const userTokens = await UserTokensService.listUserTokenForUserByTokenType({
      userId,
      tokenType: UserTokenTypesEnum.EMAIL,
    });

    if (userTokens) {
      for (let token of userTokens) {
        await UserTokensService.deactivateUserToken(token.id);
      }
    }
    await queryRunner.startTransaction();
    try {
      const token = await UserTokensService.createEmailActivationToken({
        userId,
        queryRunner,
      });
    } catch (typeOrmError) {
      console.log(typeOrmError);
      await queryRunner.rollbackTransaction();
    }
  }
}
