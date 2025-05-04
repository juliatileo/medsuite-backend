import axios, { AxiosInstance } from 'axios';

import getEnv from '@shared/env';

import { ISendMessageParams, IWhatsAppService } from './interfaces/whatsapp-interface';

export class WhatsAppService implements IWhatsAppService {
  private env = getEnv();

  private getInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.env.whatsapp.url,
      headers: { Authorization: `Bearer ${this.env.whatsapp.token}` },
    });

    return instance;
  }

  async sendMessage({ to, template, parameters, components: additionalComponents }: ISendMessageParams): Promise<void> {
    const instance = this.getInstance();

    try {
      const components = [
        {
          type: 'body',
          parameters: parameters.map((parameter) => ({ type: 'text', text: parameter })),
        },
        ,
      ];

      if (additionalComponents) {
        components.push(...additionalComponents);
      }

      await instance.post(`/${this.env.whatsapp.id}/messages`, {
        messaging_product: 'whatsapp',
        to: `55${to}`,
        type: 'template',
        template: {
          name: template,
          language: {
            code: 'pt_BR',
          },
          components,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}
