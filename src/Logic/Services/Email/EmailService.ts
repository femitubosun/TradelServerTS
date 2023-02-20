import { EmailProviderFactory, SendEmailArgs } from "Lib/Infra/External/Email";
import { TemplateService } from "Logic/Services/Template/TemplateService";
import {
  EMAIL_ACTIVATION_TOKEN_EMAIL_SUBJECT,
  PASSWORD_RESET_TOKEN_EMAIL_SUBJECT,
} from "Helpers/Messages/SystemMessages";
import { SendPasswordRestLinkArgs } from "Logic/Services/Email/TypeChecking/SendPasswordRestLinkArgs";

export class EmailService {
  public static async sendAccountActivationEmail(
    sendAccountActivationEmailArgs: SendAccountActivationEmailArgs
  ) {
    const { userEmail, activationToken } = sendAccountActivationEmailArgs;
    const emailProvider = EmailProviderFactory.build();
    const emailTemplate =
      TemplateService.getEmailVerificationTemplate(activationToken);
    const activationEmailArgs: SendEmailArgs = {
      body: emailTemplate,
      subject: EMAIL_ACTIVATION_TOKEN_EMAIL_SUBJECT,
      to: userEmail,
    };
    const resp = await emailProvider.sendEmail(activationEmailArgs);
    console.log(resp);
  }

  public static async sendPasswordResetLink(
    sendPasswordRestLinkArgs: SendPasswordRestLinkArgs
  ) {
    const { userEmail, passwordResetLink } = sendPasswordRestLinkArgs;
    const emailProvider = EmailProviderFactory.build();

    const emailTemplate =
      TemplateService.getPasswordResetEmailTemplate(passwordResetLink);

    const passwordResetEmailArgs: SendEmailArgs = {
      body: emailTemplate,
      subject: PASSWORD_RESET_TOKEN_EMAIL_SUBJECT,
      to: userEmail,
    };

    const resp = await emailProvider.sendEmail(passwordResetEmailArgs);

    console.log(resp);
  }

  public static sendEmail() {}

  public static sendBulkEmail() {}
}
