export interface SendEmailDTO {
  to: string;
  subject: string;
  body: string;
  templateId?: string;
}
