import UserTokensService from "Logic/Services/UserTokens/UserTokensService";
import { UserTokenTypesEnum } from "Entities/UserTokens";
import { RequestEmailVerificationTokenArgs } from "Logic/UseCases/Auth/TypeSetting/RequestEmailVerficationArgs";
import { EmailService } from "Logic/Services/Email/EmailService";
import UsersService from "Logic/Services/Users/UsersService";
import { BadRequestError } from "Exceptions/BadRequestError";
import {
  FAILURE,
  SUCCESS,
  USER_DOES_NOT_EXIST,
} from "Helpers/Messages/SystemMessages";

export class RequestEmailVerificationToken {
  public static async execute(
    requestEmailVerificationTokenArgs: RequestEmailVerificationTokenArgs
  ) {
    const { userId, queryRunner } = requestEmailVerificationTokenArgs;
    const user = await UsersService.getUserById(userId);

    if (!user) throw new BadRequestError(USER_DOES_NOT_EXIST);

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
      await EmailService.sendAccountActivationEmail({
        userEmail: user.email,
        activationToken: token.token,
      });
      return SUCCESS;
    } catch (typeOrmError) {
      console.log(typeOrmError);
      await queryRunner.rollbackTransaction();
      return FAILURE;
    }
  }
}
