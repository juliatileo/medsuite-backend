import { PatientInfoEntity } from '@core/entities/patient-info';

export interface IPatientInfoRepository {
  save(patientInfo: PatientInfoEntity): Promise<PatientInfoEntity>;
}
