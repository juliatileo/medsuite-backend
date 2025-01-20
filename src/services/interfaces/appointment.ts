import { AppointmentEntity } from '@core/entities/appointment';

export interface IAppointmentService {
  listByPatientId(patientId: string): Promise<AppointmentEntity[]>;
  listByDoctorId(doctorId: string): Promise<AppointmentEntity[]>;
  save(appointment: AppointmentEntity): Promise<AppointmentEntity>;
}
