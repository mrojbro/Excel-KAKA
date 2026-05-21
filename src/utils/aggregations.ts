import type { DashboardKpis, GroupSummary, LogisticsRow } from '../types'
import {
  calculatePall,
  FUEL_SURCHARGE_KOSTNAD,
  isFreightByRpuKostnad,
  isKostnadType,
  SHUNTING_KOSTNAD,
} from './calculatePall'

export function computeKpis(rows: LogisticsRow[]): DashboardKpis {
  let totalSumma = 0
  let totalRpu = 0
  let summaFreightByRpu = 0
  let summaFuelSurcharge = 0
  let summaShunting = 0

  for (const row of rows) {
    totalSumma += row.Summa
    if (isFreightByRpuKostnad(row.Kostnad)) {
      totalRpu += row.RPU
      summaFreightByRpu += row.Summa
    } else if (isKostnadType(row.Kostnad, FUEL_SURCHARGE_KOSTNAD)) {
      summaFuelSurcharge += row.Summa
    } else if (isKostnadType(row.Kostnad, SHUNTING_KOSTNAD)) {
      summaShunting += row.Summa
    }
  }

  const totalPall = calculatePall(totalRpu) // same as sumFreightPall(rows)

  return {
    totalRows: rows.length,
    totalSumma,
    totalRpu,
    totalPall,
    summaFreightByRpu,
    summaFuelSurcharge,
    summaShunting,
  }
}

type SummaGroupKey = keyof Pick<LogisticsRow, 'Butiksnamn' | 'Typ' | 'Kostnad' | 'Datum'>

function sortByDatumAsc(items: GroupSummary[]): GroupSummary[] {
  return [...items].sort((a, b) => a.label.localeCompare(b.label))
}

export function groupBySumma(rows: LogisticsRow[], key: SummaGroupKey): GroupSummary[] {
  const map = new Map<string, number>()
  for (const row of rows) {
    const label = row[key] || '(Tom)'
    map.set(label, (map.get(label) ?? 0) + row.Summa)
  }
  const items = [...map.entries()].map(([label, summa]) => ({ label, summa }))
  if (key === 'Datum') return sortByDatumAsc(items)
  return items.sort((a, b) => b.summa - a.summa)
}

/** Pall per date — only "Freight by RPU" rows; each row Pall = RPU / 1.7 */
export function groupPallByDatum(rows: LogisticsRow[]): GroupSummary[] {
  const map = new Map<string, number>()
  for (const row of rows) {
    if (!isFreightByRpuKostnad(row.Kostnad)) continue
    const label = row.Datum || '(Tom)'
    map.set(label, (map.get(label) ?? 0) + calculatePall(row.RPU))
  }
  const items = [...map.entries()].map(([label, pall]) => ({ label, summa: 0, pall }))
  return sortByDatumAsc(items)
}

/** Total Pall from freight rows — should match sum of groupPallByDatum */
export function sumFreightPall(rows: LogisticsRow[]): number {
  let totalRpu = 0
  for (const row of rows) {
    if (isFreightByRpuKostnad(row.Kostnad)) totalRpu += row.RPU
  }
  return calculatePall(totalRpu)
}

export function uniqueValues(rows: LogisticsRow[], key: keyof LogisticsRow): string[] {
  const set = new Set<string>()
  for (const row of rows) {
    const v = String(row[key] ?? '').trim()
    if (v) set.add(v)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'sv'))
}
