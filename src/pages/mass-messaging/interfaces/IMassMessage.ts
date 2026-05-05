export interface IMassMessage {
  id?: string;
  message: string;
  selectedOwners: string[];
  sentAt?: Date;
  sentBy?: string;
  status?: 'pending' | 'sending' | 'completed' | 'failed';
  totalRecipients?: number;
  successfulSends?: number;
  failedSends?: number;
}