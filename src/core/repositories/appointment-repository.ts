import { injectable } from 'inversify';
import { Repository } from 'typeorm';

import dataSource from '@core/database';
import { AppointmentEntity } from '@core/entities/appointment';

import { IAppointmentRepository } from './interfaces/appointment-repository';

@injectable()
export class AppointmentRepository implements IAppointmentRepository {
  private repository: Repository<AppointmentEntity>;

  constructor() {
    this.repository = dataSource.getRepository(AppointmentEntity);
  }

  async getById(id: string): Promise<AppointmentEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async listByPatientId(patientId: string): Promise<AppointmentEntity[]> {
    return this.repository.find({ where: { patientId } });
  }

  async listByDoctorId(doctorId: string): Promise<AppointmentEntity[]> {
    return this.repository.find({ where: { doctorId } });
  }

  async save(user: AppointmentEntity): Promise<AppointmentEntity> {
    return this.repository.save(user);
  }
}
