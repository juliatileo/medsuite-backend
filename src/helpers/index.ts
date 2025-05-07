import { SearchParameterBase } from '@core/types/pagination';

export function controllerPaginationHelper(query: qs.ParsedQs): SearchParameterBase {
  const offset = query.offset ?? query.page;

  return {
    offset: offset ? parseInt(offset as string, 10) * parseInt((query.limit as string) || '10', 10) : 0,
    orderBy: (query.orderBy as string) || 'createdAt',
    isDESC: query.isDESC === 'true',
    limit: Math.min(parseInt((query.limit as string) || '10', 10), 200),
    sort: query.sort === 'ASC' || query.sort === 'asc' ? 'ASC' : 'DESC',
  };
}
