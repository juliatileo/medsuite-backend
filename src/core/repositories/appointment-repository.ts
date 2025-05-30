import { injectable } from 'inversify';
import { FindManyOptions, Repository } from 'typeorm';

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
      .innerJoinAndSelect('appointments.Doctor', 'doctor')
      .innerJoinAndSelect('appointments.Patient', 'patient');

    if (params.doctorId) {
      query.andWhere('appointments.doctorId = :doctorId', { doctorId: params.doctorId });
    }

    if (params.patientId) {
      query.andWhere('appointments.patientId = :patientId', { patientId: params.patientId });
    }

    if (params.doctorName || params.patientName || params.description) {
      const paramsToMap = {
        doctorName: 'doctor.name',
        patientName: 'patient.name',
        description: 'appointments.description',
      };

      const queryToAdd = Object.entries(paramsToMap)
        .filter(([key]) => params[key as keyof IAppointmentSearchParameters])
        .map(([key, value], i) => (i === 0 ? `${value} LIKE :${key}` : ` OR ${value} LIKE :${key}`))
        .join('');

      const paramsToAdd = Object.entries(paramsToMap).reduce(
        (acc, [key]) => {
          if (params[key as keyof IAppointmentSearchParameters]) {
            acc[key] = Like(`%${params[key as keyof IAppointmentSearchParameters]}%`);
          }
          return acc;
        },
        {} as Record<string, unknown>,
      );

      query.andWhere(queryToAdd, paramsToAdd);
    }

    query
      .orderBy(
        `
      CASE 
      WHEN appointments.status = 4 THEN 0
      WHEN appointments.status = 1 THEN 1
      ELSE 2
      END
    `,
        'ASC',
      )
      .addOrderBy(`CASE WHEN appointments.date >= NOW() THEN 0 ELSE 1 END`, 'ASC')
      .addOrderBy('ABS(TIMESTAMPDIFF(SECOND, NOW(), appointments.date))', 'ASC');

    return query.getMany();
  }

  async save(user: AppointmentEntity): Promise<AppointmentEntity> {
    return this.repository.save(user);
  }

  async getByWhere(options: FindManyOptions<AppointmentEntity>): Promise<AppointmentEntity[]> {
    return this.repository.find(options);
  }
}
