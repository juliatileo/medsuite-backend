export interface ISendMessageParams {
  to: string;
  template: string;
  parameters: string[];
  components?: {
    type: 'body' | 'button';
    sub_type: 'url';
    index: number;
    parameters: [
      {
        type: 'text';
        text: string;
      },
    ];
  }[];
}

export interface IWhatsAppService {
  sendMessage(params: ISendMessageParams): Promise<void>;
}
