import UsersService from "Logic/Services/Users/UsersService";
import { BadRequestError } from "Exceptions/BadRequestError";
import { USER_DOES_NOT_EXIST } from "Helpers/Messages/SystemMessages";
import UserTokensService from "Logic/Services/UserTokens/UserTokensService";

export class StartRecoverPassword {
  public static async execute(email: string) {
    const user = await UsersService.getUserByEmail(email);
    if (!user) throw new BadRequestError(USER_DOES_NOT_EXIST);

    const token = await UserTokensService.createPasswordRecoveryToken();
  }
}
