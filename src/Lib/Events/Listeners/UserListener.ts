import UsersService from "Logic/Services/Users/UsersService";
import { EmailService } from "Logic/Services/Email/EmailService";
import { OnSignUpEventListenerArgs } from "Lib/Events/Listeners/TypeChecking/OnSignUpEventListenerArgs";

export default class UserListener {
  public static async onUserSignIn(userId: number) {
    await UsersService.updateUserLastLoginDate(userId);
  }

  public static async onUserSignUp(
    onSignUpEventListenerArgs: OnSignUpEventListenerArgs
  ) {
    await EmailService.sendAccountActivationEmail(onSignUpEventListenerArgs);
  }
}
