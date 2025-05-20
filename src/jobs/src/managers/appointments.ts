import { inject, injectable } from 'inversify';
import { LessThan } from 'typeorm';

import { AppointmentEntity, AppointmentStatus } from '@core/entities/appointment';
import { IAppointmentRepository } from '@core/repositories/interfaces/appointment-repository';
import { TYPES } from '@core/types';

@injectable()
export class AppointmentsManager {
  constructor(@inject(TYPES.AppointmentRepository) private readonly appointmentRepository: IAppointmentRepository) {}

  async updateAppointmentStatus(): Promise<void> {
    const appointments = await this.appointmentRepository.getByWhere({
      where: {
        date: LessThan(new Date()),
        status: AppointmentStatus.SCHEDULED,
      },
    });

    await Promise.all(
      appointments.map(async (appointment: AppointmentEntity) => {
        await this.appointmentRepository.save({ ...appointment, status: AppointmentStatus.PENDING_DONE });
      }),
    );
  }
}
