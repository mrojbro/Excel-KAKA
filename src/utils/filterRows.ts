import type { FilterState, LogisticsRow } from '../types'

export function applyFilters(rows: LogisticsRow[], filters: FilterState): LogisticsRow[] {
  return rows.filter((row) => {
    if (filters.butiksnamn && row.Butiksnamn !== filters.butiksnamn) return false
    if (filters.butiksnr && row.Butiksnr !== filters.butiksnr) return false
    if (filters.typ && row.Typ !== filters.typ) return false
    if (filters.kostnad && row.Kostnad !== filters.kostnad) return false
    if (filters.datum && row.Datum !== filters.datum) return false
    return true
  })
}
