import { inject, injectable } from 'inversify';

import { AppointmentEntity } from '@core/entities/appointment';
import { IAppointmentRepository } from '@core/repositories/interfaces/appointment-repository';
import { TYPES } from '@core/types';
import { HttpError } from '@core/types/error';

import { IAppointmentService } from './interfaces/appointment';

@injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    @inject(TYPES.AppointmentRepository)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  listByPatientId(patientId: string): Promise<AppointmentEntity[]> {
    return this.appointmentRepository.listByPatientId(patientId);
  }

  listByDoctorId(doctorId: string): Promise<AppointmentEntity[]> {
    return this.appointmentRepository.listByDoctorId(doctorId);
  }

  save(appointment: AppointmentEntity): Promise<AppointmentEntity> {
    if (appointment.id) {
      const appointmentExists = this.appointmentRepository.getById(appointment.id);

      if (!appointmentExists) {
        throw new HttpError('Appointment does not exist', 404);
      }
    }

    return this.appointmentRepository.save(appointment);
  }
}
