import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { HttpError } from '@core/types/error';

import getEnv from '@shared/env';

const env = getEnv();

export function auth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new HttpError('Token is required', 400);
  }

  try {
    if (!env.auth.secret) {
      throw new HttpError('Secret is empty', 500);
    }

    const decoded = jwt.verify(token, env.auth.secret) as {
      email: string;
      userId: string;
      admin: boolean;
    };

    req.session = decoded;

    return next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new HttpError('Authentication error', 500);
  }
}
