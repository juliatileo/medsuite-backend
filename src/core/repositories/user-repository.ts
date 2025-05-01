import { injectable } from 'inversify';
import { FindOneOptions, Repository } from 'typeorm';

import dataSource from '@core/database';
import { UserEntity, UserType } from '@core/entities/user';

import { IUserRepository } from '@repositories/interfaces/user-repository';

@injectable()
export class UserRepository implements IUserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = dataSource.getRepository(UserEntity);
  }

  async list(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async listPatients(): Promise<UserEntity[]> {
    return this.repository.find({ where: { type: UserType.PATIENT }, relations: ['patientInfo'] });
  }

  async getById(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { id }, relations: ['patientInfo'] });
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findOne(params: FindOneOptions<UserEntity>): Promise<UserEntity | null> {
    return this.repository.findOne(params);
  }
}
