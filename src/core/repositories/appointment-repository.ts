import { injectable } from "inversify";
import { Repository } from "typeorm";

import dataSource from "@core/database";
import { IAppointmentRepository } from "./interfaces/appointment-repository";
import { AppointmentEntity } from "@core/entities/appointment";

@injectable()
export class AppointmentRepository implements IAppointmentRepository {
  private repository: Repository<AppointmentEntity>;

  constructor() {
    this.repository = dataSource.getRepository(AppointmentEntity);
  }

  async listByPatientId(patientId: string): Promise<AppointmentEntity[]> {
    return this.repository.find({ where: { patientId } });
  }

  async listByDoctorId(doctorId: string): Promise<AppointmentEntity[]> {
    return this.repository.find({ where: { doctorId } });
  }

  async save(user: AppointmentEntity): Promise<AppointmentEntity> {
    return this.repository.save(user);
  }
}
