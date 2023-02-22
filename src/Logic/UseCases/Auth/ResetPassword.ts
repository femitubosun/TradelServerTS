import { ResetPasswordArgs } from "Logic/UseCases/Auth/TypeSetting/ResetPasswordArgs";
import UserTokensService from "Logic/Services/UserTokensService";
import { BadRequestError } from "Exceptions/BadRequestError";
import {
  FAILURE,
  INVALID_TOKEN,
  INVALID_TOKEN_TYPE,
  SUCCESS,
  TOKEN_EXPIRED,
  USER_DOES_NOT_EXIST,
} from "Helpers/Messages/SystemMessages";
import { UserTokenTypesEnum } from "Entities/UserTokens";
import UsersService from "Logic/Services/UsersService";
import { ChangePasswordDto } from "TypeChecking/Users/ChangePasswordDto";
import { DateTime } from "luxon";

export class ResetPassword {
  public static async execute(resetPasswordArgs: ResetPasswordArgs) {
    const { password, passwordResetToken, queryRunner } = resetPasswordArgs;

    const token = await UserTokensService.getUserTokenByToken(
      passwordResetToken
    );
    if (!token) throw new BadRequestError(INVALID_TOKEN);

    if (token.tokenType != UserTokenTypesEnum.PASSWORD_RESET)
      throw new BadRequestError(INVALID_TOKEN_TYPE);

    if (token.expired || DateTime.now() > token.expiresOn)
      throw new BadRequestError(TOKEN_EXPIRED);

    const user = await UsersService.getUserById(token.userId);

    if (!user) throw new BadRequestError(USER_DOES_NOT_EXIST);

    await queryRunner.startTransaction();

    try {
      const changePasswordArgs: ChangePasswordDto = {
        identifier: user.id,
        identifierType: "id",
        password,
        queryRunner,
      };
      await UsersService.changeUserPassword(changePasswordArgs);
      await UserTokensService.deactivateUserToken(token.id);
      await queryRunner.commitTransaction();
      return SUCCESS;
    } catch (typeOrmError) {
      await queryRunner.rollbackTransaction();
      return FAILURE;
    }
  }
}
