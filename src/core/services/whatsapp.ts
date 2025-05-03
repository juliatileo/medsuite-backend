import axios, { AxiosInstance } from 'axios';

import getEnv from '@shared/env';

import { ISendMessageParams, IWhatsAppService } from './interfaces/whatsapp-interface';

export class WhatsAppService implements IWhatsAppService {
  private env = getEnv();

  getInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.env.whatsapp.url,
      headers: { Authorization: `Bearer ${this.env.whatsapp.token}` },
    });

    return instance;
  }

  async sendMessage({ to, name, email, password }: ISendMessageParams): Promise<void> {
    const instance = this.getInstance();

    try {
      await instance.post(`/${this.env.whatsapp.id}/messages`, {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: 'account_created',
          language: {
            code: 'pt_BR',
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: name,
                },
                {
                  type: 'text',
                  text: email,
                },
                {
                  type: 'text',
                  text: password,
                },
              ],
            },
          ],
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
}
