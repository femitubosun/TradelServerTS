import { render } from "mustache";
import emailConfirmationMail from "Logic/Services/Template/templates/emailConfirmationMail";
import passwordResetEmail from "Logic/Services/Template/templates/passwordResetMail";

export class TemplateService {
  public static getEmailVerificationTemplate(token: string) {
    return render(emailConfirmationMail, {
      token,
    });
  }

  public static getPasswordResetEmailTemplate(resetLink: string) {
    return render(passwordResetEmail, {
      resetLink,
    });
  }
}
