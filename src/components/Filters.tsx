import type { FilterState, LogisticsRow, RowReviews } from '../types'
import { uniqueValues } from '../utils/aggregations'
import { countReviews } from '../utils/reviewFilter'
import { ReviewFilterToggle } from './ReviewFilterToggle'

interface FiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  allRows: LogisticsRow[]
  excelFilteredRows: LogisticsRow[]
  tableRowCount: number
  rowReviews: RowReviews
}

export function Filters({
  filters,
  onChange,
  allRows,
  excelFilteredRows,
  tableRowCount,
  rowReviews,
}: FiltersProps) {
  const reviewCounts = countReviews(excelFilteredRows, rowReviews)
  const butiksnamnOptions = uniqueValues(allRows, 'Butiksnamn')
  const butiksnrOptions = uniqueValues(allRows, 'Butiksnr')
  const typOptions = uniqueValues(allRows, 'Typ')
  const kostnadOptions = uniqueValues(allRows, 'Kostnad')
  const datumOptions = uniqueValues(allRows, 'Datum')

  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch })

  const clearAll = () =>
    onChange({
      butiksnamn: '',
      butiksnr: '',
      typ: '',
      kostnad: '',
      datum: '',
      kontroll: '',
    })

  const selectClass =
    'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]'

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Filter
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-text-muted)]">
            Visar <strong className="text-[var(--color-text)]">{tableRowCount}</strong> rader i tabellen
            {filters.kontroll ? (
              <span className="text-[var(--color-text-muted)]">
                {' '}
                (av {excelFilteredRows.length} filtrerade)
              </span>
            ) : null}          </span>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Rensa filter
          </button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <label className="block">
          <span className="mb-1 block text-xs text-[var(--color-text-muted)]">Butiksnamn</span>
          <select
            className={selectClass}
            value={filters.butiksnamn}
            onChange={(e) => update({ butiksnamn: e.target.value })}
          >
            <option value="">Alla</option>
            {butiksnamnOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[var(--color-text-muted)]">Butiksnr</span>
          <select
            className={selectClass}
            value={filters.butiksnr}
            onChange={(e) => update({ butiksnr: e.target.value })}
          >
            <option value="">Alla</option>
            {butiksnrOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[var(--color-text-muted)]">Typ</span>
          <select
            className={selectClass}
            value={filters.typ}
            onChange={(e) => update({ typ: e.target.value })}
          >
            <option value="">Alla</option>
            {typOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[var(--color-text-muted)]">Kostnad</span>
          <select
            className={selectClass}
            value={filters.kostnad}
            onChange={(e) => update({ kostnad: e.target.value })}
          >
            <option value="">Alla</option>
            {kostnadOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[var(--color-text-muted)]">Datum</span>
          <select
            className={selectClass}
            value={filters.datum}
            onChange={(e) => update({ datum: e.target.value })}
          >
            <option value="">Alla</option>
            {datumOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ReviewFilterToggle
        value={filters.kontroll}
        onChange={(kontroll) => update({ kontroll })}
        counts={reviewCounts}
      />
    </div>
  )
}