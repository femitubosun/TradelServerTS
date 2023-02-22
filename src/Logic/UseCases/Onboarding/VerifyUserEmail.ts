import { EmailVerificationArgs } from "Logic/UseCases/Onboarding/";
import UserTokensService from "Logic/Services/UserTokensService";
import userTokensService from "Logic/Services/UserTokensService";
import usersService from "Logic/Services/UsersService";
import { BadRequestError } from "Exceptions/BadRequestError";
import {
  EMAIL_VERIFICATION_SUCCESS,
  FAILURE,
  INVALID_TOKEN_TYPE,
  NO_TOKEN_RECORD,
  SOMETHING_WENT_WRONG,
  TOKEN_EXPIRED,
  UNAUTHORIZED_OPERATION,
  USER_DOES_NOT_EXIST,
} from "Helpers/Messages/SystemMessages";
import { UnauthorizedError } from "Exceptions/UnauthorizedError";
import { UserTokenTypesEnum } from "Entities/UserTokens";
import { DateTime } from "luxon";
import { InternalServerError } from "Exceptions/InternalServerError";
import UsersService from "Logic/Services/UsersService";

export class VerifyUserEmail {
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
      await UserTokensService.getUserTokenByToken(emailVerificationToken);

    if (!dbEmailVerificationToken) throw new BadRequestError(NO_TOKEN_RECORD);

    if (dbEmailVerificationToken.tokenType != UserTokenTypesEnum.EMAIL)
      throw new BadRequestError(INVALID_TOKEN_TYPE);

    const tokenOwner = await UsersService.getUserById(
      dbEmailVerificationToken.userId
    );

    if (!tokenOwner) throw new UnauthorizedError(USER_DOES_NOT_EXIST);

    if (tokenOwner.hasVerifiedEmail) return;

    if (tokenOwner.id != user.id) {
      throw new UnauthorizedError(UNAUTHORIZED_OPERATION);
    }

    if (
      dbEmailVerificationToken.expired ||
      DateTime.now() > dbEmailVerificationToken.expiresOn
    )
      throw new BadRequestError(TOKEN_EXPIRED);

    const resp = await usersService.activateUserEmail(user.id);

    if (resp === FAILURE) throw new InternalServerError(SOMETHING_WENT_WRONG);

    await userTokensService.deactivateUserToken(dbEmailVerificationToken.id);

    if (resp === FAILURE) throw new InternalServerError(SOMETHING_WENT_WRONG);

    return EMAIL_VERIFICATION_SUCCESS;
  }
}
