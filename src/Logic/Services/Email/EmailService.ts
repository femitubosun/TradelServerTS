import { EmailProviderFactory, SendEmailArgs } from "Lib/Infra/External/Email";
import { TemplateService } from "Logic/Services/Template/TemplateService";
import {
  EMAIL_ACTIVATION_TOKEN_EMAIL_SUBJECT,
  PASSWORD_RESET_TOKEN_EMAIL_SUBJECT,
} from "Helpers/Messages/SystemMessages";
import { SendPasswordResetLinkDtoType } from "Logic/Services/Email/TypeChecking/SendPasswordRestLinkDtoType";
import { SendAccountActivationEmailArgs } from "Logic/Services/Email/TypeChecking/SendAccountActivationEmailArgs";

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
    await emailProvider.sendEmail(activationEmailArgs);
  }

  public static async sendPasswordResetLink(
    sendPasswordRestLinkArgs: SendPasswordResetLinkDtoType
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

    await emailProvider.sendEmail(passwordResetEmailArgs);
  }

  public static sendEmail() {
    throw new Error("Method not implemented");
  }

  public static sendBulkEmail() {
    throw new Error("Method not implemented");
  }
}
