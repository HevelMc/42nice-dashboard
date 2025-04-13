import { Request } from '@adonisjs/core/http'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export function paginatedTableQuery(
  query: ModelQueryBuilderContract<any>,
  request: Request,
  searchInColumns: string[] = [],
  filterOverrides: { id: string; value: (string | number)[] }[] = []
) {
  const pageIndex = request.input('pageIndex', 1)
  const pageSize = Math.min(request.input('pageSize', 10), 50)
  const sort = request.input('sort', {})
  const filters: { id: string; value: (string | number)[] }[] = [
    ...filterOverrides,
    ...request.input('filters', []),
  ]
  const searchQuery = request.input('search', '')

  return query
    .where((query1) => {
      if (searchQuery && searchInColumns.length) {
        query1.where((query2) => {
          for (const column of searchInColumns) {
            if (column.includes('.')) {
              const [relation, field] = column.split('.')
              query2.orWhereHas(relation, (builder) => {
                builder.where(field, 'ilike', `%${searchQuery}%`)
              })
            } else {
              query2.orWhere(column, 'ilike', `%${searchQuery}%`)
            }
          }
        })
      }
    })
    .where((query3) => filters.map((filter) => query3.whereIn(filter.id, filter.value)))
    .orderBy(sort?.id || 'id', sort?.desc === true || sort?.desc === 'true' ? 'desc' : 'asc')
    .paginate(pageIndex, pageSize)
}
