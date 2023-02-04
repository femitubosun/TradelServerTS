import { JwtProvider } from "Lib/Infra/Internal/JwtProvider";
import { PasswordEncryptionProvider } from "Lib/Infra/Internal/PasswordEncryptionProvider";
import UsersService from "Logic/Services/Users/UsersService";
import { SignInUserDTO } from "Logic/UseCases/Auth/TypeSetting";
import { BadRequestError } from "Logic/Exceptions";
import { CHECK_EMAIL_AND_PASSWORD } from "Utils/Messages";
import { SignInUserWithEmailUseCaseReturnType } from "Logic/UseCases/Auth/TypeSetting/TokenPayloadType";

export class SignInUserWithEmailUseCase {
  public static async execute(
    signInUserDTO: SignInUserDTO
  ): Promise<SignInUserWithEmailUseCaseReturnType> {
    const { email, password } = signInUserDTO;

    const user = await UsersService.findUserByEmail(email);

    if (!user) throw new BadRequestError(CHECK_EMAIL_AND_PASSWORD);

    const isMatch = PasswordEncryptionProvider.verifyPassword(
      password,
      user.password
    );
    if (!isMatch) throw new BadRequestError(CHECK_EMAIL_AND_PASSWORD);

    const token = JwtProvider.signUser(user);

    return {
      user: {
        identifier: user.identifier,
        email: user.email,
      },
      token,
    };
  }
}
