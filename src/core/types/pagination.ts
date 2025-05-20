import { UserType } from '@core/entities/user';

export interface IUserSearchParameters {
  name: string;
  taxIdentifier: string;
  type: UserType;
}

export interface IAppointmentSearchParameters {
  patientName?: string;
  doctorName?: string;
  description?: string;
  doctorId: string;
  patientId: string;
}
