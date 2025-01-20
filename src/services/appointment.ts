import { inject, injectable } from "inversify";

import { AppointmentEntity } from "@core/entities/appointment";
import { IAppointmentRepository } from "@core/repositories/interfaces/appointment-repository";
import { TYPES } from "@core/types";

import { IAppointmentService } from "./interfaces/appointment";

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
