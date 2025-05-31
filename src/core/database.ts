import path from 'path';
import { DataSource } from 'typeorm';

import getEnv from '@shared/env';

const {
  database: { host, username, database, port, password },
} = getEnv();

const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host,
  port: parseInt(port || '5432', 10),
  username,
  password,
  database,
  migrations: [`${path.join(__dirname, 'migrations/*{.ts,.js}')}`],
  entities: [`${path.join(__dirname, 'entities/*{.ts,.js}')}`],
  migrationsRun: true,
  synchronize: false,
});

export const initializeDataSource = async (): Promise<DataSource> => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
    // eslint-disable-next-line no-console
    console.info('database connected');
  }
  return dataSource;
};

export default dataSource;
