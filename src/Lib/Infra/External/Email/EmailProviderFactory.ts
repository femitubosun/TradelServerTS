import { emailConfig } from "AppConfig/emailConfig";
import { LoggingProvider } from "Lib/Infra/Internal/Logging";
import { SendInBlueDriver } from "Lib/Infra/External/Email/SendInBlueDriver";
import { EmailProvider } from "Lib/Infra/External/Email/EmailProvider";

export class EmailProviderFactory {
  public static build() {
    if (EmailProviderFactory.getCurrentProvider() === "sendinblue") {
      return new EmailProvider(new SendInBlueDriver());
    }
  }

  public static getCurrentProvider() {
    return emailConfig.EMAIL_PROVIDER;
  }
}
