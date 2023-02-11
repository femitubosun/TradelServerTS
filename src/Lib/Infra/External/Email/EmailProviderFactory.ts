import { emailConfig } from "Config/index";
import { SendInBlueDriver } from "Lib/Infra/External/Email/SendInBlueDriver";
import { EmailProvider } from "Lib/Infra/External/Email/EmailProvider";
import { NodeMailerSMTPDriver } from "Lib/Infra/External/Email/NodeMailerSMTPDriver";

export class EmailProviderFactory {
  public static build(): EmailProvider {
    if (EmailProviderFactory.getCurrentProvider() === "sendinblue") {
      return new EmailProvider(new SendInBlueDriver());
    }
    return new EmailProvider(new NodeMailerSMTPDriver());
  }

  public static getCurrentProvider() {
    return emailConfig.provider;
  }
}
