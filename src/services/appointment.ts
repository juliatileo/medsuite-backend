import { inject, injectable } from "inversify";
import { IAppointmentService } from "./interfaces/appointment";
import { TYPES } from "@core/types";
import { IAppointmentRepository } from "@core/repositories/interfaces/appointment-repository";
import { AppointmentEntity } from "@core/entities/appointment";

@injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    @inject(TYPES.AppointmentRepository)
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  listByPatientId(patientId: string): Promise<AppointmentEntity[]> {}

  listByDoctorId(doctorId: string): Promise<AppointmentEntity[]> {}

  save(appointment: AppointmentEntity): Promise<AppointmentEntity> {}
}
