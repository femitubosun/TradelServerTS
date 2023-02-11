import {
  IEmailDriver,
  SendBulkEmailArgs,
  SendEmailArgs,
} from "Lib/Infra/External/Email";
import { createTransport, Transport } from "nodemailer";

import { emailConfig } from "Config/index";

interface SMTPProviderConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
}

interface NodeMailSMTPConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class NodeMailerSMTPDriver implements IEmailDriver {
  transport: Transport;

  sendBulkEmail(sendBulkEmailArgs: SendBulkEmailArgs): null {
    return null;
  }

  async sendEmail(sendEmailArgs: SendEmailArgs): Promise<any> {
    const emailSender = emailConfig.emailFromEmail;
    const { to, subject, body } = sendEmailArgs;
    const transport = this.getNodeMailerTransport();
    console.log(await transport.verify());
    // return await transport.sendMail({
    //   from: emailSender,
    //   to,
    //   subject,
    //   text: body,
    // });
  }

  private getSMTPConfig(): any {
    const provider = emailConfig.provider as keyof typeof emailConfig;
    return emailConfig[provider];
  }

  private getNodeMailerTransport() {
    const smtpConfig = this.getSMTPConfig();
    console.log(smtpConfig);
    return createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.user,
      },
    });
  }
}
