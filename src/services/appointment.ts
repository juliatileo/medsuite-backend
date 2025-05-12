import { inject, injectable } from 'inversify';

import { AppointmentEntity } from '@core/entities/appointment';
import { IAppointmentRepository } from '@core/repositories/interfaces/appointment-repository';
import { TYPES } from '@core/types';
import { IAppointmentSearchParameters } from '@core/types/pagination';

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

  async getFiltered(params: IAppointmentSearchParameters): Promise<AppointmentEntity[]> {
    return this.appointmentRepository.getFiltered(params);
  }

  save(appointment: AppointmentEntity): Promise<AppointmentEntity> {
    return this.appointmentRepository.save(appointment);
  }
}
