import { AppointmentEntity } from '@core/entities/appointment';
import { IAppointmentSearchParameters, Pagination } from '@core/types/pagination';

export interface IAppointmentRepository {
  getById(id: string): Promise<AppointmentEntity | null>;
  listByPatientId(patientId: string): Promise<AppointmentEntity[]>;
  listByDoctorId(doctorId: string): Promise<AppointmentEntity[]>;
  getPaginated(params: IAppointmentSearchParameters): Promise<Pagination<AppointmentEntity>>;
  save(appointment: AppointmentEntity): Promise<AppointmentEntity>;
}
