export interface MailModel {
  mail_id:  string;
  username: string;
  recipients: RecipientsModel[];
  message?: string;
  timestamp?: Date;
}

export interface RecipientsModel {
  username: string;
  isRead?: boolean;
}

export interface SendMailResponse {
  mail_id: string;
  timestamp: Date;
}

export interface MailListResponse {
  mail_id: string;
}
