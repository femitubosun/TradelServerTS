import UsersService from "Logic/Services/Users/UsersService";
import { BadRequestError } from "Exceptions/BadRequestError";
import { USER_DOES_NOT_EXIST } from "Helpers/Messages/SystemMessages";
import UserTokensService from "Logic/Services/UserTokens/UserTokensService";
import { StartPasswordRecoveryArgs } from "Logic/UseCases/Auth/TypeSetting/StartPasswordRecoveryArgs";
import { EmailService } from "Logic/Services/Email/EmailService";

export class StartPasswordRecovery {
  public static async execute(
    startRecoverPasswordArgs: StartPasswordRecoveryArgs
  ) {
    const { userEmail, queryRunner } = startRecoverPasswordArgs;
    const user = await UsersService.getUserByEmail(userEmail);

    if (!user) throw new BadRequestError(USER_DOES_NOT_EXIST);

    const token = await UserTokensService.createPasswordRecoveryToken({
      userId: user.id,
      queryRunner,
    });

    // await EmailService.sendPasswordResetLink();
  }
}
