import type { LogisticsRow } from '../types'

/** Stable key for a row across filters and review state. */
export function getRowKey(row: LogisticsRow): string {
  return [
    row.FO,
    row.Datum,
    row.Butiksnr,
    row.Kostnad,
    row.Typ,
    row.Mängd,
    row.Summa,
    row.RPU,
  ].join('\u001f')
}
