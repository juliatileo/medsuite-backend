import { injectable } from "inversify";
import { Between, Repository } from "typeorm";

import dataSource from "@core/database";
import { AppointmentEntity } from "@core/entities/appointment";

import { IAppointmentRepository } from "./interfaces/appointment-repository";
import { DateTime } from "luxon";

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
      order: { date: "ASC" },
    });
  }

  async listByDoctorId(doctorId: string): Promise<AppointmentEntity[]> {
    return this.repository.find({
      where: { doctorId },
      order: { date: "ASC" },
    });
  }

  async save(user: AppointmentEntity): Promise<AppointmentEntity> {
    return this.repository.save(user);
  }

  async listByDate(date: Date): Promise<AppointmentEntity[]> {
    DateTime.fromJSDate(date).startOf("day").toJSDate(),
      DateTime.fromJSDate(date).endOf("day").toJSDate();

    return this.repository.find({
      where: {
        date: Between(
          DateTime.fromJSDate(date).startOf("day").toJSDate(),
          DateTime.fromJSDate(date).endOf("day").toJSDate()
        ),
      },
    });
  }
}
