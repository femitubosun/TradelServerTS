import { JwtHelper, PasswordEncryptionHelper } from "Helpers/index";
import UsersService from "Logic/Services/Users/UsersService";
import { SignInUserArgs } from "Logic/UseCases/Auth/TypeSetting";
import { BadRequestError } from "Exceptions/index";
import { CHECK_EMAIL_AND_PASSWORD } from "Helpers/Messages/SystemMessages";
import { SignInUserWithEmailUseCaseReturnType } from "Logic/UseCases/Auth/TypeSetting/TokenPayloadType";
import Event from "Lib/Events";
import { eventTypes } from "Lib/Events/Listeners/TypeChecking/eventTypes";

export class SignInUserWithEmail {
  public static async execute(
    signInUserDTO: SignInUserArgs
  ): Promise<SignInUserWithEmailUseCaseReturnType> {
    const { email, password } = signInUserDTO;

    const user = await UsersService.getUserByEmail(email);

    if (!user) throw new BadRequestError(CHECK_EMAIL_AND_PASSWORD);

    const isMatch = PasswordEncryptionHelper.verifyPassword(
      password,
      user.password
    );
    if (!isMatch) throw new BadRequestError(CHECK_EMAIL_AND_PASSWORD);

    const token = JwtHelper.signUser(user);
    Event.emit(eventTypes.user.signIn, user.id);
    return {
      user: {
        identifier: user.identifier,
        email: user.email,
      },
      token,
    };
  }
}
