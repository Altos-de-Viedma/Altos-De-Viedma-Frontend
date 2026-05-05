export interface IMessageRequest {
  serverUrl: string;
  message: string;
  phoneNumber: string;
  instanceName: string;
  apikey: string;
}

export interface IMessageResponse {
  success: boolean;
  message?: string;
  error?: string;
}