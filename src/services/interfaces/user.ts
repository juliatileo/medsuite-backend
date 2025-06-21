import { UserEntity, UserType } from '@core/entities/user';
import { IUserSearchParameters } from '@core/types/pagination';

export interface IUserService {
  list(): Promise<UserEntity[]>;
  listByType(type: UserType): Promise<UserEntity[]>;
  getFiltered(params: IUserSearchParameters): Promise<UserEntity[]>;
  save(body: UserEntity): Promise<{ user: UserEntity; token: string }>;
  update(body: UserEntity): Promise<UserEntity>;
  login({ email, password }: { email: string; password: string }): Promise<{ user: UserEntity; token: string }>;
  getById(id: string): Promise<UserEntity>;
  forgotPassword(email: string): Promise<string>;
  resetPassword(params: { resetToken: string; password: string }): Promise<void>;
  getDashboard(userId: string): Promise<{
    totalUsers: number;
    concludedAppointments: number;
    pendingAppointments: number;
    todayAppointments: number;
  }>;
}
