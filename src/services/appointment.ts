import { inject, injectable } from 'inversify';

import { AppointmentEntity } from '@core/entities/appointment';
import { IAppointmentRepository } from '@core/repositories/interfaces/appointment-repository';
import { TYPES } from '@core/types';
import { IAppointmentSearchParameters, Pagination } from '@core/types/pagination';

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

  async getPaginated(params: IAppointmentSearchParameters): Promise<Pagination<AppointmentEntity>> {
    return this.appointmentRepository.getPaginated(params);
  }

  save(appointment: AppointmentEntity): Promise<AppointmentEntity> {
    return this.appointmentRepository.save(appointment);
  }

  listByDate(date: string): Promise<AppointmentEntity[]> {
    return this.appointmentRepository.listByDate(new Date(date));
  }
}
