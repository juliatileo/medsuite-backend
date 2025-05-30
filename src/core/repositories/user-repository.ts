import { injectable } from 'inversify';
import { FindOneOptions, Repository } from 'typeorm';

import dataSource from '@core/database';
import { UserEntity, UserType } from '@core/entities/user';
import { IUserSearchParameters } from '@core/types/pagination';

import { IUserRepository } from '@repositories/interfaces/user-repository';

import { Like } from '@shared/utils/like';

@injectable()
export class UserRepository implements IUserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = dataSource.getRepository(UserEntity);
  }

  async list(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async listByType(type: UserType): Promise<UserEntity[]> {
    return this.repository.find({
      where: { type },
      select: ['id', 'name'],
      order: { createdAt: 'DESC' },
    });
  }

  async getFiltered(params: IUserSearchParameters): Promise<UserEntity[]> {
    const query = this.repository.createQueryBuilder('users').orderBy('users.createdAt', 'DESC');

    if (params?.name) {
      query.orWhere('users.name like :name', { name: Like(params.name) });
    }

    if (params?.taxIdentifier) {
      query.orWhere('users.taxIdentifier like :taxIdentifier', { taxIdentifier: Like(params.taxIdentifier) });
    }

    if (params?.type) {
      query.andWhere('users.type = :type', { type: params.type });
    }

    return query.getMany();
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
