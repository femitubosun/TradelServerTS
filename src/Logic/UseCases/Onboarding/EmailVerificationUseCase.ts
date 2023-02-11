import { EmailVerificationArgs } from "Logic/UseCases/Onboarding/";
import UserTokensService from "Logic/Services/UserTokens/UserTokensService";
import UsersService from "Logic/Services/Users/UsersService";
import { BadRequestError } from "Exceptions/BadRequestError";
import {
  EMAIL_VERIFICATION_SUCCESS,
  FAILURE,
  INVALID_TOKEN,
  INVALID_TOKEN_TYPE,
  NO_TOKEN_RECORD,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  TOKEN_EXPIRED,
} from "Utils/Messages";
import { UnauthorizedError } from "Exceptions/UnauthorizedError";
import { UserTokenTypesEnum } from "Entities/UserTokens";
import usersService from "Logic/Services/Users/UsersService";
import { UpdateUserRecordArgs } from "Logic/Services/Users/TypeSetting";
import { DateTime } from "luxon";
import userTokensService from "Logic/Services/UserTokens/UserTokensService";
import { InternalServerError } from "Exceptions/InternalServerError";

export class EmailVerificationUseCase {
  /**
   * This Use Case handles Email Verification
   *
   * The Email verification process includes
   *
   *     - Query the token by token_value
   *     - Check if the token's user is the same as the Current User
   *     - Check if the token as expired.
   *     - Confirm if the token is an email Verification Token
   *     - Verify User
   */

  public static async execute(emailVerificationArgs: EmailVerificationArgs) {
    const { emailVerificationToken, user } = emailVerificationArgs;

    const dbEmailVerificationToken =
      await UserTokensService.findUserTokenByToken(emailVerificationToken);

    if (!dbEmailVerificationToken) throw new BadRequestError(NO_TOKEN_RECORD);

    if (dbEmailVerificationToken.type != UserTokenTypesEnum.EMAIL)
      throw new BadRequestError(INVALID_TOKEN_TYPE);

    if (dbEmailVerificationToken.user != user) throw new UnauthorizedError();

    if (
      dbEmailVerificationToken.expired ||
      DateTime.now() > dbEmailVerificationToken.expiresOn
    )
      throw new BadRequestError(TOKEN_EXPIRED);

    const resp = await usersService.activateUserEmail(user.id);

    if (resp === FAILURE) throw new InternalServerError(SOMETHING_WENT_WRONG);

    const tokenResp = await userTokensService.deactivateUserToken(
      dbEmailVerificationToken.id
    );
    if (resp === FAILURE) throw new InternalServerError(SOMETHING_WENT_WRONG);

    return EMAIL_VERIFICATION_SUCCESS;
  }
}
