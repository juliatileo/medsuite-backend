import { injectable } from 'inversify';
import { Repository } from 'typeorm';

import dataSource from '@core/database';
import { PatientInfoEntity } from '@core/entities/patient-info';

import { IPatientInfoRepository } from '@repositories/interfaces/patient-info-repository';

@injectable()
export class PatientInfoRepository implements IPatientInfoRepository {
  private repository: Repository<PatientInfoEntity>;

  constructor() {
    this.repository = dataSource.getRepository(PatientInfoEntity);
  }

  async save(patientInfo: PatientInfoEntity): Promise<PatientInfoEntity> {
    return this.repository.save(patientInfo);
  }
}
