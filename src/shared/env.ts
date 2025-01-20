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
    },
    server: {
      url,
    },
  };
}
