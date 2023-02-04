import { SendEmailDTO } from "Lib/Infra/External/Email/TypeSetting/SendEmailDTO";
import { SendBulkEmailDTO } from "Lib/Infra/External/Email/TypeSetting/SendBulkEmailDTO";

export interface IEmailDriver {
  sendEmail(sendEmailDTO: SendEmailDTO): null;

  sendBulkEmail(sendBulkEmailDTO: SendBulkEmailDTO): null;
}
