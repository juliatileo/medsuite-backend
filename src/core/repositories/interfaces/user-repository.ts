import { UserEntity } from '@entities/user';

export interface IUserRepository {
  list(): Promise<UserEntity[]>;
  save(user: UserEntity): Promise<UserEntity>;
  getByEmail(email: string): Promise<UserEntity | null>;
}
