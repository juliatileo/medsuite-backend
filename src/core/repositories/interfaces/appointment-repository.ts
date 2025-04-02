import { AppointmentEntity } from "@core/entities/appointment";

export interface IAppointmentRepository {
  getById(id: string): Promise<AppointmentEntity | null>;
  listByPatientId(patientId: string): Promise<AppointmentEntity[]>;
  listByDoctorId(doctorId: string): Promise<AppointmentEntity[]>;
  save(appointment: AppointmentEntity): Promise<AppointmentEntity>;
  listByDate(date: Date): Promise<AppointmentEntity[]>;
}
