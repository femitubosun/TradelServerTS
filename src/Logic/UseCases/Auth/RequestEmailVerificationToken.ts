import UserTokensService from "Logic/Services/UserTokensService";
import { UserTokenTypesEnum } from "TypeChecking/UserTokens";
import { RequestEmailVerificationTokenArgs } from "Logic/UseCases/Auth/TypeSetting/RequestEmailVerficationArgs";
import { EmailService } from "Logic/Services/Email/EmailService";
import UsersService from "Logic/Services/UsersService";
import { BadRequestError } from "Exceptions/BadRequestError";
import { generateStringOfLength } from "Utils/generateStringOfLength";
import { businessConfig } from "Config/index";
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
      for (const token of userTokens) {
        await UserTokensService.deactivateUserToken(token.id);
      }
    }
    await queryRunner.startTransaction();
    try {
      const token = generateStringOfLength(businessConfig.emailTokenLength);

      const otpToken = await UserTokensService.createEmailActivationToken({
        userId,
        token,
        queryRunner,
      });
      await queryRunner.commitTransaction();
      await EmailService.sendAccountActivationEmail({
        userEmail: user.email,
        activationToken: otpToken.token,
      });

      return SUCCESS;
    } catch (typeOrmError) {
      console.log(typeOrmError);
      await queryRunner.rollbackTransaction();
      return FAILURE;
    }
  }
}
