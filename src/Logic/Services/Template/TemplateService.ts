import { render } from "mustache";
import emailConfirmation from "Logic/Services/Template/templates/emailConfirmation";

export class TemplateService {
  public static getEmailVerificationTemplate(token: string) {
    return render(emailConfirmation, {
      token,
    });
  }
}
