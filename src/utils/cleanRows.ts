import type { LogisticsRow } from '../types'
import { calculatePall, isFreightByRpuKostnad } from './calculatePall'
import { parseDate } from './parseDate'
import { parseNumber } from './parseNumber'

function cellStr(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

function isEmptyRow(raw: Record<string, unknown>): boolean {
  return Object.values(raw).every(
    (v) => v === null || v === undefined || String(v).trim() === '',
  )
}

export function shouldExcludeRow(raw: Record<string, unknown>): boolean {
  const fo = cellStr(raw.FO)
  if (fo.toLowerCase().includes('subtotal')) return true

  const butiksnr = cellStr(raw.Butiksnr)
  if (!butiksnr) return true
  if (butiksnr.toUpperCase() === 'CDCANGERED') return true

  return false
}

export function transformRawRow(raw: Record<string, unknown>): LogisticsRow | null {
  if (isEmptyRow(raw)) return null
  if (shouldExcludeRow(raw)) return null

  const rpu = parseNumber(raw.RPU)
  const kostnad = cellStr(raw.Kostnad)
  return {
    FO: cellStr(raw.FO),
    Datum: parseDate(raw.Datum),
    Butiksnamn: cellStr(raw.Butiksnamn),
    Butiksnr: cellStr(raw.Butiksnr),
    Typ: cellStr(raw.Typ),
    Kostnad: kostnad,
    Mängd: parseNumber(raw.Mängd),
    Summa: parseNumber(raw.Summa),
    RPU: rpu,
    Pall: isFreightByRpuKostnad(kostnad) ? calculatePall(rpu) : 0,
  }
}

export function cleanRows(rawRows: Record<string, unknown>[]): LogisticsRow[] {
  const result: LogisticsRow[] = []
  for (const raw of rawRows) {
    const row = transformRawRow(raw)
    if (row) result.push(row)
  }
  return result
}
