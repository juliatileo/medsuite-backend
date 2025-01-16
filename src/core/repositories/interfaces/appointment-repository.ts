import { AppointmentEntity } from "@core/entities/appointment";

export interface IAppointmentRepository {
  listByPatientId(patientId: string): Promise<AppointmentEntity[]>;
  listByDoctorId(doctorId: string): Promise<AppointmentEntity[]>;
  save(appointment: AppointmentEntity): Promise<AppointmentEntity>;
}
