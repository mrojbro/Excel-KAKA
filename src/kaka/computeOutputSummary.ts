import type { OutputRow } from './types'

export interface SummaryLine {
  godsslagTemp: string
  godsslag: string
  rowCount: number
  kolliAntalSum: number
  kolliViktSum: number
}

export interface OutputSummary {
  lines: SummaryLine[]
  totals: {
    rowCount: number
    kolliAntalSum: number
    kolliViktSum: number
  }
}

function parseNum(value: string): number {
  if (!value.trim()) return 0
  const n = parseFloat(value.trim().replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

function roundUpToEven(value: number): number {
  if (value <= 0) return 0
  const roundedUp = Math.ceil(value)
  return roundedUp % 2 === 0 ? roundedUp : roundedUp + 1
}

function normalizeSummaryKolliAntal(godsslag: string, value: number): number {
  if (godsslag === 'Pall' || godsslag === 'B-Pall') {
    return roundUpToEven(value)
  }
  return value
}

export function formatSummaryNumber(n: number): string {
  if (n === 0) return '0'
  const rounded = Math.round(n * 1000) / 1000
  return Number.isInteger(rounded)
    ? rounded.toLocaleString('sv-SE')
    : rounded.toLocaleString('sv-SE', { maximumFractionDigits: 3 })
}

export function computeOutputSummary(rows: OutputRow[]): OutputSummary {
  const map = new Map<string, SummaryLine>()

  for (const row of rows) {
    const godsslagTemp = row['Godsslag Temp'].trim() || '—'
    const godsslag = row.Godsslag.trim() || '—'
    const key = `${godsslagTemp}\0${godsslag}`

    const line = map.get(key) ?? {
      godsslagTemp,
      godsslag,
      rowCount: 0,
      kolliAntalSum: 0,
      kolliViktSum: 0,
    }

    line.rowCount += 1
    line.kolliAntalSum += parseNum(row['Kolli antal'])
    line.kolliViktSum += parseNum(row['Kolli vikt'])
    map.set(key, line)
  }

  const lines = [...map.values()].sort(
    (a, b) =>
      a.godsslagTemp.localeCompare(b.godsslagTemp, 'sv') ||
      a.godsslag.localeCompare(b.godsslag, 'sv'),
  )

  for (const line of lines) {
    line.kolliAntalSum = normalizeSummaryKolliAntal(
      line.godsslag,
      line.kolliAntalSum,
    )
  }

  const totals = lines.reduce(
    (acc, line) => ({
      rowCount: acc.rowCount + line.rowCount,
      kolliAntalSum: acc.kolliAntalSum + line.kolliAntalSum,
      kolliViktSum: acc.kolliViktSum + line.kolliViktSum,
    }),
    { rowCount: 0, kolliAntalSum: 0, kolliViktSum: 0 },
  )

  return { lines, totals }
}
