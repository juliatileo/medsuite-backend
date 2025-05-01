export interface IEnv {
  database: {
    host: string | undefined;
    port: string | undefined;
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
  };
  auth: {
    secret: string | undefined;
    resetTokenImplementation: boolean | undefined;
    defaultResetToken: string | undefined;
  };
  server: {
    url: string | undefined;
  };
  web: {
    url: string | undefined;
  };
}
