import { UserType } from '@core/entities/user';

export type Pagination<T> = {
  rows: T[];
  count: number;
};

export type SearchParameterBase = {
  offset: number;
  limit?: number;
  page?: number;
  orderBy: string;
  isDESC: boolean;
  sort?: 'ASC' | 'DESC';
};

export interface IUsersSearchParameters extends SearchParameterBase {
  name: string;
  taxIdentifier: string;
  type: UserType;
}
