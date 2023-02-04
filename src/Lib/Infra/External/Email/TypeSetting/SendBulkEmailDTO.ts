export interface SendBulkEmailDTO {
  to: string;
  subject: string;
  body: string;
  templateId?: string;
}
