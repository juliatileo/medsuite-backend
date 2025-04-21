import { UserEntity } from '@entities/user';

export interface IUserRepository {
  list(): Promise<UserEntity[]>;
  listPatients(): Promise<UserEntity[]>;
  save(user: UserEntity): Promise<UserEntity>;
  getByEmail(email: string): Promise<UserEntity | null>;
}
