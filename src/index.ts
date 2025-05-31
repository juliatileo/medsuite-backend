/* eslint-disable no-console */
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { NextFunction, Request, Response, static as static_ } from 'express';
import { STATUS_CODES } from 'http';
import 'reflect-metadata';
import 'dotenv/config';
import { InversifyExpressServer } from 'inversify-express-utils';

import { container } from '@core/container';
import { initializeDataSource } from '@core/database';
import { HttpError } from '@core/types/error';

import '@controllers/.';
import '@jobs/jobs';

initializeDataSource().then(() => {
  const server = new InversifyExpressServer(container, null, {
    rootPath: '/api',
  });

  server.setConfig((app) => {
    app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );
    app.use(bodyParser.json());
    app.use(cors({ origin: '*' }));
    app.use('/uploads', static_('uploads'));
  });

  server.setErrorConfig((app) => {
    app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
      if (err) {
        const status = err?.status || 500;

        return res.status(status || 500).json({
          status: status || 500,
          description: STATUS_CODES[status] || STATUS_CODES[500],
          message: err?.message || 'Internal Server Error',
        });
      }

      next();
    });
  });

  const app = server.build();
  app.listen(3333, () => console.log('rodando app'));
});
