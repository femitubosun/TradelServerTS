import UsersService from "Logic/Services/Users/UsersService";
import { EmailProviderFactory } from "Lib/Infra/External/Email";

export default class UserListener {
  public static async onUserSignIn(userId: number) {
    const user = await UsersService.updateUserLastLoginDate(userId);
  }

  public static async onUserSignUp(userId: number) {
    const user = await UsersService.getUserById(userId);
    const emailProvider = EmailProviderFactory.build();

    console.log("Signing Up User with id", userId);
  }
}
