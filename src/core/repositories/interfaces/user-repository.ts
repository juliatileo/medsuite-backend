import { FindOneOptions } from 'typeorm';

import { IUserSearchParameters } from '@core/types/pagination';

import { UserEntity, UserType } from '@entities/user';

export interface IUserRepository {
  list(): Promise<UserEntity[]>;
  listByType(type: UserType): Promise<UserEntity[]>;
  getFiltered(params: IUserSearchParameters): Promise<UserEntity[]>;
  save(user: UserEntity): Promise<UserEntity>;
  getByEmail(email: string): Promise<UserEntity | null>;
  getById(id: string): Promise<UserEntity | null>;
  findOne(params: FindOneOptions<UserEntity>): Promise<UserEntity | null>;
  countByType(type: UserType): Promise<number>;
}
