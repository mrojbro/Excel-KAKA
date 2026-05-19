import { useMemo, useState } from 'react'
import type { LogisticsRow, RowReviewStatus, RowReviews } from '../types'
import { formatCurrency, formatNumber, formatPall } from '../utils/format'
import { getRowKey } from '../utils/rowKey'
import { getRowReview } from '../utils/reviewFilter'
import { RowStatusButtons } from './RowStatusButtons'
import { typBadgeClass } from '../utils/typBadge'

type SortKey = keyof LogisticsRow
type SortDir = 'asc' | 'desc'

interface CostTableProps {
  rows: LogisticsRow[]
  rowReviews: RowReviews
  onReviewChange: (rowKey: string, status: RowReviewStatus | undefined) => void
}

const COLUMNS: { key: SortKey; label: string; align?: 'right' }[] = [
  { key: 'FO', label: 'FO' },
  { key: 'Datum', label: 'Datum' },
  { key: 'Butiksnamn', label: 'Butiksnamn' },
  { key: 'Butiksnr', label: 'Butiksnr' },
  { key: 'Typ', label: 'Typ' },
  { key: 'Kostnad', label: 'Kostnad' },
  { key: 'Mängd', label: 'Mängd', align: 'right' },
  { key: 'Summa', label: 'Summa', align: 'right' },
  { key: 'RPU', label: 'RPU', align: 'right' },
  { key: 'Pall', label: 'Pall', align: 'right' },
]

function compareRows(a: LogisticsRow, b: LogisticsRow, key: SortKey, dir: SortDir): number {
  const av = a[key]
  const bv = b[key]
  let cmp = 0
  if (typeof av === 'number' && typeof bv === 'number') {
    cmp = av - bv
  } else {
    cmp = String(av).localeCompare(String(bv), 'sv')
  }
  return dir === 'asc' ? cmp : -cmp
}

function renderCell(row: LogisticsRow, key: SortKey) {
  switch (key) {
    case 'Typ':
      return (
        <span
          className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${typBadgeClass(row.Typ)}`}
        >
          {row.Typ || '—'}
        </span>
      )
    case 'Mängd':
      return formatNumber(row.Mängd)
    case 'Summa':
      return formatCurrency(row.Summa)
    case 'RPU':
      return formatNumber(row.RPU)
    case 'Pall':
      return formatPall(row.Pall)
    default:
      return String(row[key] ?? '—')
  }
}

function rowHighlightClass(status: RowReviewStatus | undefined): string {
  if (status === 'ok') return 'bg-[var(--color-success)]/[0.06]'
  if (status === 'not_ok') return 'bg-[var(--color-danger)]/[0.06]'
  return ''
}

export function CostTable({ rows, rowReviews, onReviewChange }: CostTableProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('Datum')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase()
    let filtered = rows
    if (q) {
      filtered = rows.filter((row) =>
        Object.values(row).some((v) => String(v).toLowerCase().includes(q)),
      )
    }
    return [...filtered].sort((a, b) => compareRows(a, b, sortKey, sortDir))
  }, [rows, search, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const colSpan = COLUMNS.length + 1

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Detaljerad data
        </h2>
        <input
          type="search"
          placeholder="Sök i tabellen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
        />
      </div>
      <div className="max-h-[480px] overflow-auto">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--color-surface-elevated)] shadow-[0_1px_0_var(--color-border)]">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`cursor-pointer select-none px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] hover:text-[var(--color-accent)] ${col.align === 'right' ? 'text-right' : ''}`}
                  onClick={() => toggleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1 text-[var(--color-accent)]">
                      {sortDir === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Kontroll
              </th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-4 py-8 text-center text-[var(--color-text-muted)]"
                >
                  Inga rader matchar sökning eller filter
                </td>
              </tr>
            ) : (
              displayed.map((row) => {
                const rowKey = getRowKey(row)
                const reviewStatus = getRowReview(row, rowReviews)
                return (
                  <tr
                    key={rowKey}
                    className={`border-t border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-elevated)]/50 ${rowHighlightClass(reviewStatus)}`}
                  >
                    {COLUMNS.map((col) => (
                      <td
                        key={col.key}
                        className={`px-3 py-2 tabular-nums text-[var(--color-text)] ${col.align === 'right' ? 'text-right' : ''} ${col.key === 'Butiksnamn' ? 'max-w-[200px] truncate' : ''}`}
                      >
                        {renderCell(row, col.key)}
                      </td>
                    ))}
                    <td className="px-3 py-2 whitespace-nowrap">
                      <RowStatusButtons
                        status={reviewStatus}
                        onChange={(status) => onReviewChange(rowKey, status)}
                      />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="border-t border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-text-muted)]">
        {displayed.length} rader visade
      </p>
    </section>
  )
}
