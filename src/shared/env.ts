import { IEnv } from '@shared/types/env.types';

export default function getEnv(): IEnv {
  const {
    DATABASE_HOST: host,
    DATABASE_PORT: port,
    DATABASE_USER: username,
    DATABASE_PASS: password,
    DATABASE_NAME: database,
    AUTH_SECRET: secret,
    SERVER_URL: url,
    RESET_TOKEN_IMPLEMENTATION: resetTokenImplementation,
    DEFAULT_RESET_TOKEN: defaultResetToken,
    WEB_URL: webUrl,
    WHATSAPP_API_URL: whatsappApiUrl,
    WHATSAPP_API_TOKEN: whatsappApiToken,
    WHATSAPP_API_ID: whatsappApiId,
  } = process.env;

  return {
    database: {
      host,
      port,
      username,
      password,
      database,
    },
    auth: {
      secret,
      resetTokenImplementation: resetTokenImplementation === 'true',
      defaultResetToken,
    },
    server: {
      url,
    },
    web: {
      url: webUrl,
    },
    whatsapp: {
      url: whatsappApiUrl,
      token: whatsappApiToken,
      id: whatsappApiId,
    },
  };
}
