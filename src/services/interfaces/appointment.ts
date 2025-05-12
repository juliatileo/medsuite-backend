import { AppointmentEntity } from '@core/entities/appointment';
import { IAppointmentSearchParameters } from '@core/types/pagination';

export interface IAppointmentService {
  listByPatientId(patientId: string): Promise<AppointmentEntity[]>;
  listByDoctorId(doctorId: string): Promise<AppointmentEntity[]>;
  getFiltered(params: IAppointmentSearchParameters): Promise<AppointmentEntity[]>;
  save(appointment: AppointmentEntity): Promise<AppointmentEntity>;
}
