import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

import { UserEntity } from '@core/entities/user';
import { IPatientInfoRepository } from '@core/repositories/interfaces/patient-info-repository';
import { IUserRepository } from '@core/repositories/interfaces/user-repository';
import { IWhatsAppService } from '@core/services/interfaces/whatsapp-interface';
import { TYPES } from '@core/types';
import { HttpError } from '@core/types/error';

import getEnv from '@shared/env';
import { IEnv } from '@shared/types/env.types';

import { IUserService } from './interfaces/user';

@injectable()
export class UserService implements IUserService {
  private env: IEnv = getEnv();

  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.PatientInfoRepository)
    private readonly patientInfoRepository: IPatientInfoRepository,
    @inject(TYPES.WhatsAppService)
    private readonly whatsappService: IWhatsAppService,
  ) {}

  async list(): Promise<UserEntity[]> {
    return this.userRepository.list();
  }

  async listPatients(): Promise<UserEntity[]> {
    return this.userRepository.listPatients();
  }

  async getById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    return user;
  }

  async save(body: UserEntity): Promise<{ user: UserEntity; token: string }> {
    if (!this.env.auth.secret) {
      throw new HttpError('Secret is empty', 500);
    }

    const password = await bcrypt.hash(body.password, 10);

    const user = await this.userRepository.save({
      ...body,
      password,
    });

    const token = jwt.sign({ userId: user.id, email: user.email, type: user.type }, this.env.auth.secret, {
      expiresIn: '1d',
    });

    if (body.patientInfo) {
      await this.patientInfoRepository.save({ ...body.patientInfo, userId: user.id });
    }

    await this.whatsappService.sendMessage({
      to: user.cellphone,
      name: user.name,
      email: user.email,
      password: body.password,
    });

    return { user, token };
  }

  async update(body: UserEntity): Promise<UserEntity> {
    const user = await this.userRepository.getById(body.id);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    await this.userRepository.save(body);

    if (body.patientInfo) {
      await this.patientInfoRepository.save({ ...body.patientInfo, userId: user.id });
    }

    return { ...user, ...body };
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

    if (!this.env.auth.secret) {
      throw new HttpError('Secret is empty', 500);
    }

    const token = jwt.sign({ ...user }, this.env.auth.secret, { expiresIn: '1d' });

    return { user, token };
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.userRepository.getByEmail(email);

    if (!user) throw new HttpError('User not found', 404);

    let resetToken = this.env.auth.defaultResetToken || '112233';

    if (this.env.auth.resetTokenImplementation) {
      if (!this.env.auth.secret) {
        throw new HttpError('Secret is empty', 500);
      }

      resetToken = jwt.sign({ ...user }, this.env.auth.secret, { expiresIn: '1h' });
    }

    await this.userRepository.save({
      ...user,
      resetToken,
      resetTokenExpiration: DateTime.now().plus({ hour: 1 }).toJSDate(),
    });

    return `${this.env.web.url}/reset-password?token=${resetToken}`;
  }

  async resetPassword({ resetToken, password }: { resetToken: string; password: string }): Promise<void> {
    const user = await this.userRepository.findOne({ where: { resetToken: resetToken } });

    if (!user || !user.resetTokenExpiration || user.resetTokenExpiration < DateTime.now().toJSDate()) {
      throw new HttpError('Expired or invalid token', 404);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.save({
      ...user,
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiration: null,
    });
  }
}
