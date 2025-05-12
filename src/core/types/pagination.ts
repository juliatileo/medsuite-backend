import { UserType } from '@core/entities/user';

export interface IUserSearchParameters {
  name: string;
  taxIdentifier: string;
  type: UserType;
}

export interface IAppointmentSearchParameters {
  patientName: string;
  doctorName: string;
  doctorId: string;
  patientId: string;
}
