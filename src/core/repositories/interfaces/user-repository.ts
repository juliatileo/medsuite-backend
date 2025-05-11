import { FindOneOptions } from 'typeorm';

import { IUserSearchParameters, Pagination } from '@core/types/pagination';

import { UserEntity } from '@entities/user';

export interface IUserRepository {
  list(): Promise<UserEntity[]>;
  getPaginated(params: IUserSearchParameters): Promise<Pagination<UserEntity>>;
  save(user: UserEntity): Promise<UserEntity>;
  getByEmail(email: string): Promise<UserEntity | null>;
  getById(id: string): Promise<UserEntity | null>;
  findOne(params: FindOneOptions<UserEntity>): Promise<UserEntity | null>;
}
