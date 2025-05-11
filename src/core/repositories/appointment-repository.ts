import { injectable } from 'inversify';
import { Repository } from 'typeorm';

import dataSource from '@core/database';
import { AppointmentEntity } from '@core/entities/appointment';
import { IAppointmentSearchParameters, Pagination } from '@core/types/pagination';

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
    return this.repository.find({
      where: { patientId },
      order: { date: 'ASC' },
    });
  }

  async listByDoctorId(doctorId: string): Promise<AppointmentEntity[]> {
    return this.repository.find({
      where: { doctorId },
      order: { date: 'ASC' },
    });
  }

  async getPaginated(params: IAppointmentSearchParameters): Promise<Pagination<AppointmentEntity>> {
    const query = this.repository
      .createQueryBuilder('appointments')
      .leftJoinAndSelect('appointments.Doctor', 'doctor')
      .leftJoinAndSelect('appointments.Patient', 'patient')
      .offset(params.offset || 0)
      .limit(params.limit || 10)
      .orderBy('appointments.createdAt', params.sort);

    if (params.doctorId) {
      query.where('appointments.doctorId = :doctorId', { doctorId: params.doctorId });
    }

    if (params.patientId) {
      query.where('appointments.patientId = :patientId', { patientId: params.patientId });
    }

    if (params.doctorName) {
      query.orWhere('doctor.name = :doctorName', { doctorName: params.doctorName });
    }

    if (params.patientName) {
      query.orWhere('patient.name = :patientName', { patientName: params.patientName });
    }

    const [rows, count] = await query.getManyAndCount();

    return { rows, count };
  }

  async save(user: AppointmentEntity): Promise<AppointmentEntity> {
    return this.repository.save(user);
  }
}
