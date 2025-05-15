import { injectable } from 'inversify';
import { Repository } from 'typeorm';

import dataSource from '@core/database';
import { AppointmentEntity } from '@core/entities/appointment';
import { IAppointmentSearchParameters } from '@core/types/pagination';

import { Like } from '@shared/utils/like';

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

  async getFiltered(params: IAppointmentSearchParameters): Promise<AppointmentEntity[]> {
    const query = this.repository
      .createQueryBuilder('appointments')
      .leftJoinAndSelect('appointments.Doctor', 'doctor')
      .leftJoinAndSelect('appointments.Patient', 'patient')
      .orderBy('appointments.date', 'ASC');

    if (params.doctorId) {
      query.where('appointments.doctorId = :doctorId', { doctorId: params.doctorId });
    }

    if (params.patientId) {
      query.where('appointments.patientId = :patientId', { patientId: params.patientId });
    }

    if (params.doctorName && params.patientName)
      query.andWhere('doctor.name like :doctorName or patient.name like :patientName', {
        doctorName: Like(params.doctorName),
        patientName: Like(params.patientName),
      });
    else if (params.doctorName) query.andWhere('doctor.name like :doctorName', { doctorName: Like(params.doctorName) });
    else if (params.patientName)
      query.andWhere('patient.name like :patientName', { patientName: Like(params.patientName) });

    return query.getMany();
  }

  async save(user: AppointmentEntity): Promise<AppointmentEntity> {
    return this.repository.save(user);
  }
}
