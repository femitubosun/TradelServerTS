import * as SibApiV3Sdk from "sib-api-v3-sdk";

import {
  IEmailDriver,
  SendBulkEmailArgs,
  SendEmailArgs,
} from "Lib/Infra/External/Email/";
import { emailConfig } from "Config/emailConfig";

export class SendInBlueDriver implements IEmailDriver {
  transactionEmailApi;

  constructor() {
    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      this.getApiKey();
    this.transactionEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
  }

  public async sendBulkEmail(sendBulkEmailArgs: SendBulkEmailArgs) {
    console.log(sendBulkEmailArgs);
    await null;
  }

  public async sendEmail(sendEmailArgs: SendEmailArgs) {
    const { subject, body, to } = sendEmailArgs;
    await this.transactionEmailApi.sendTransacEmail({
      sender: {
        email: emailConfig.emailFromEmail,
        name: emailConfig.emailFromName,
      },
      subject,
      htmlContent: `<h3>${body}</h3>`,
      messageVersions: [
        {
          to: [{ email: to }],
        },
      ],
    });
  }

  private getApiKey() {
    return emailConfig.sendinblue.apiKey;
  }
}
