import { FindManyOptions } from 'typeorm';

import { AppointmentEntity } from '@core/entities/appointment';
import { IAppointmentSearchParameters } from '@core/types/pagination';

export interface IAppointmentRepository {
  getById(id: string): Promise<AppointmentEntity | null>;
  listByPatientId(patientId: string): Promise<AppointmentEntity[]>;
  listByDoctorId(doctorId: string): Promise<AppointmentEntity[]>;
  getFiltered(params: IAppointmentSearchParameters): Promise<AppointmentEntity[]>;
  save(appointment: AppointmentEntity): Promise<AppointmentEntity>;
  getByWhere(options: FindManyOptions<AppointmentEntity>): Promise<AppointmentEntity[]>;
  countByOptions(options: FindManyOptions<AppointmentEntity>): Promise<number>;
}
