import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { Between } from 'typeorm';

import { AppointmentEntity, AppointmentStatus } from '@core/entities/appointment';
import { UserEntity, UserType } from '@core/entities/user';
import { IAppointmentRepository } from '@core/repositories/interfaces/appointment-repository';
import { IPatientInfoRepository } from '@core/repositories/interfaces/patient-info-repository';
import { IUserRepository } from '@core/repositories/interfaces/user-repository';
import { IWhatsAppService } from '@core/services/interfaces/whatsapp-interface';
import { TYPES } from '@core/types';
import { HttpError } from '@core/types/error';
import { IUserSearchParameters } from '@core/types/pagination';
import { WhatsappTemplate } from '@core/types/whatsapp';

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
    @inject(TYPES.AppointmentRepository) private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async list(): Promise<UserEntity[]> {
    return this.userRepository.list();
  }

  async listByType(type: UserType): Promise<UserEntity[]> {
    return this.userRepository.listByType(type);
  }

  async getFiltered(params: IUserSearchParameters): Promise<UserEntity[]> {
    return this.userRepository.getFiltered(params);
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

    // await this.whatsappService.sendMessage({
    //   to: user.cellphone,
    //   template: WhatsappTemplate.ACCOUNT_CREATED,
    //   parameters: [user.name, user.email, body.password],
    // });

    return { user, token };
  }

  async update(body: UserEntity): Promise<UserEntity> {
    const user = await this.userRepository.getById(body.id);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
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

    await this.whatsappService.sendMessage({
      to: user.cellphone,
      template: WhatsappTemplate.RESET_PASSWORD_TOKEN,
      parameters: [resetToken],
      components: [
        {
          type: 'button',
          sub_type: 'url',
          index: 0,
          parameters: [
            {
              type: 'text',
              text: resetToken,
            },
          ],
        },
      ],
    });

    return `/reset-password?token=${resetToken}`;
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

  async getDashboard(userId: string): Promise<{
    totalUsers: number;
    scheduledAppointments: number;
    canceledAppointments: number;
    concludedAppointments: number;
    pendingAppointments: number;
    todayAppointments: number;
  }> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    let [
      totalUsers,
      scheduledAppointments,
      canceledAppointments,
      concludedAppointments,
      pendingAppointments,
      todayAppointments,
    ] = [0, 0, 0, 0, 0, 0];

    totalUsers = await this.userRepository.countByType(
      user.type === UserType.DOCTOR ? UserType.PATIENT : UserType.DOCTOR,
    );

    let appointmentCountParams: Partial<AppointmentEntity>;

    if (user.type === UserType.DOCTOR) appointmentCountParams = { doctorId: user.id };
    else appointmentCountParams = { patientId: user.id };

    concludedAppointments = await this.appointmentRepository.countByOptions({
      where: { ...appointmentCountParams, status: AppointmentStatus.DONE },
    });

    pendingAppointments = await this.appointmentRepository.countByOptions({
      where: { ...appointmentCountParams, status: AppointmentStatus.PENDING_DONE },
    });

    todayAppointments = await this.appointmentRepository.countByOptions({
      where: {
        ...appointmentCountParams,
        date: Between(DateTime.now().startOf('day').toJSDate(), DateTime.now().endOf('day').toJSDate()),
      },
    });

    scheduledAppointments = await this.appointmentRepository.countByOptions({
      where: {
        ...appointmentCountParams,
        status: AppointmentStatus.SCHEDULED,
      },
    });

    canceledAppointments = await this.appointmentRepository.countByOptions({
      where: {
        ...appointmentCountParams,
        status: AppointmentStatus.CANCELED,
      },
    });

    todayAppointments = await this.appointmentRepository.countByOptions({
      where: {
        ...appointmentCountParams,
        date: Between(DateTime.now().startOf('day').toJSDate(), DateTime.now().endOf('day').toJSDate()),
      },
    });

    return {
      totalUsers,
      concludedAppointments,
      scheduledAppointments,
      canceledAppointments,
      pendingAppointments,
      todayAppointments,
    };
  }
}
