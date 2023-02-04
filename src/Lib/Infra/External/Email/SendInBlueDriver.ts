import {
  IEmailDriver,
  SendBulkEmailDTO,
  SendEmailDTO,
} from "Lib/Infra/External/Email/TypeSetting/IEmailDriver";

export class SendInBlueDriver implements IEmailDriver {
  sendBulkEmail(sendBulkEmailDTO: SendBulkEmailDTO): null {
    return null;
  }

  sendEmail(sendEmailDTO: SendEmailDTO): null {
    return null;
  }
}
