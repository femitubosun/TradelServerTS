import { EmailProviderFactory } from "Lib/Infra/External/Email";

class EmailService {
  public static async sendAccountActivationEmail(
    sendAccountActivationEmailArgs: SendAccountActivationEmailArgs
  ) {
    const emailProvider = EmailProviderFactory.build();
  }
}
