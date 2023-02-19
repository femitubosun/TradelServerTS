import { EmailProviderFactory } from "Lib/Infra/External/Email";
import sprightly from "sprightly";

export class EmailService {
  public static sendAccountActivationEmail(
    sendAccountActivationEmailArgs: SendAccountActivationEmailArgs
  ) {
    const emailProvider = EmailProviderFactory.build();
    const res = sprightly.sprightly("./activation-email.html", {
      name: "Goal",
    });
    console.log(res);

    return res;
  }

  public static async sendPasswordResetLink() {}

  public static sendEmail() {}

  public static sendBulkEmail() {}
}
