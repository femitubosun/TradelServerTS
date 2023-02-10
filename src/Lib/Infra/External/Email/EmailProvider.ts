import {
  IEmailDriver,
  SendBulkEmailArgs,
  SendEmailArgs,
} from "Lib/Infra/External/Email/TypeSetting";

export class EmailProvider {
  constructor(private emailDriver: IEmailDriver) {}

  public async sendEmail(sendMailArgs: SendEmailArgs) {
    return this.emailDriver.sendEmail(sendMailArgs);
  }

  public async sendBulkEmail(sendBulkMailArgs: SendBulkEmailArgs) {
    return this.emailDriver.sendBulkEmail(sendBulkMailArgs);
  }
}
