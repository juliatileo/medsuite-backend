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
  };
  server: {
    url: string | undefined;
  };
}
