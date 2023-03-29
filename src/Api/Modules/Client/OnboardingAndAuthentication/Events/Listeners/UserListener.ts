import UsersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
import { EmailService } from "Logic/Services/Email/EmailService";
import { OnSignUpEventListenerArgs } from "Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/GeneralPurpose/OnSignUpEventListenerArgs";

export class UserListener {
  public static async onUserSignIn(userId: number) {
    await UsersService.updateUserLastLoginDate(userId);
  }

  public static async onUserSignUp(
    onSignUpEventListenerArgs: OnSignUpEventListenerArgs
  ) {
    await EmailService.sendAccountActivationEmail(onSignUpEventListenerArgs);
  }
}
