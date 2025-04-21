import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { UserEntity } from '@core/entities/user';
import { IUserRepository } from '@core/repositories/interfaces/user-repository';
import { TYPES } from '@core/types';
import { HttpError } from '@core/types/error';

import getEnv from '@shared/env';

import { IUserService } from './interfaces/user';

const env = getEnv();
@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async list(): Promise<UserEntity[]> {
    return this.userRepository.list();
  }

  async listPatients(): Promise<UserEntity[]> {
    return this.userRepository.listPatients();
  }

  async save(body: UserEntity): Promise<{ user: UserEntity; token: string }> {
    if (!env.auth.secret) {
      throw new HttpError('Secret is empty', 500);
    }

    const password = await bcrypt.hash(body.password, 10);

    const user = await this.userRepository.save({
      ...body,
      password,
    });

    const token = jwt.sign({ userId: user.id, email: user.email, type: user.type }, env.auth.secret, {
      expiresIn: '1d',
    });

    return { user, token };
  }

  async login({ email, password }: { email: string; password: string }): Promise<{ user: UserEntity; token: string }> {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      throw new HttpError('Incorrect password', 400);
    }

    if (!env.auth.secret) {
      throw new HttpError('Secret is empty', 500);
    }

    const token = jwt.sign({ ...user }, env.auth.secret, { expiresIn: '1d' });

    return { user, token };
  }
}
