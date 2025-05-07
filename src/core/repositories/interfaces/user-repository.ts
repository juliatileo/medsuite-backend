import { FindOneOptions } from 'typeorm';

import { IUsersSearchParameters, Pagination } from '@core/types/pagination';

import { UserEntity } from '@entities/user';

export interface IUserRepository {
  list(): Promise<UserEntity[]>;
  getPaginated(params: IUsersSearchParameters): Promise<Pagination<UserEntity>>;
  save(user: UserEntity): Promise<UserEntity>;
  getByEmail(email: string): Promise<UserEntity | null>;
  getById(id: string): Promise<UserEntity | null>;
  findOne(params: FindOneOptions<UserEntity>): Promise<UserEntity | null>;
}
