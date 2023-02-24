import UsersService from "Logic/Services/UsersService";
import { BadRequestError } from "Exceptions/BadRequestError";
import { USER_DOES_NOT_EXIST } from "Helpers/Messages/SystemMessages";
import UserTokensService from "Logic/Services/UserTokensService";
import { StartPasswordRecoveryDtoType } from "Logic/UseCases/Auth/TypeSetting/StartPasswordRecoveryArgs";
import { SendPasswordResetLinkDtoType } from "Logic/Services/Email/TypeChecking/SendPasswordRestLinkDtoType";
import { businessConfig } from "Config/index";
import { expressConfig } from "Config/expressConfig";
import { generateStringOfLength } from "Utils/generateStringOfLength";
import { UserTokenTypesEnum } from "TypeChecking/UserTokens";
import { EmailService } from "Logic/Services/Email/EmailService";

export class StartPasswordRecovery {
  public static async execute(
    startRecoverPasswordDto: StartPasswordRecoveryDtoType
  ) {
    const { userEmail, queryRunner } = startRecoverPasswordDto;
    const user = await UsersService.getUserByEmail(userEmail);

    if (!user) throw new BadRequestError(USER_DOES_NOT_EXIST);

    const token = generateStringOfLength(
      businessConfig.passwordResetTokenLength
    );

    const expiresOn = businessConfig.currentDateTime.plus({
      minute: businessConfig.passwordResetTokenExpiresInMinutes,
    });

    const passwordResetToken = await UserTokensService.createUserTokenRecord({
      userId: user.id,
      tokenType: UserTokenTypesEnum.PASSWORD_RESET,
      token,
      queryRunner,
      expiresOn,
    });

    const passwordResetLink = `http://${businessConfig.host}:${expressConfig.port}/Interface/Process/ResetPassword/${passwordResetToken.token}`;
    const sendPassowrdResetLinkDto: SendPasswordResetLinkDtoType = {
      userEmail: user.email,
      passwordResetLink: passwordResetLink,
    };

    await EmailService.sendPasswordResetLink(sendPassowrdResetLinkDto);
  }
}
