import { AxiosInstance } from 'axios';

export interface ISendMessageParams {
  to: string;
  name: string;
  email: string;
  password: string;
}

export interface IWhatsAppService {
  getInstance(): AxiosInstance;
  sendMessage(params: ISendMessageParams): Promise<void>;
}
