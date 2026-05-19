import type { ReviewFilter } from '../types'

interface ReviewFilterToggleProps {
  value: ReviewFilter
  onChange: (value: ReviewFilter) => void
  counts: { ok: number; notOk: number; unset: number }
}

const OPTIONS: { value: ReviewFilter; label: string }[] = [
  { value: '', label: 'Alla' },
  { value: 'ok', label: 'OK' },
  { value: 'not_ok', label: 'Not OK' },
  { value: 'unset', label: 'Ej granskad' },
]

export function ReviewFilterToggle({ value, onChange, counts }: ReviewFilterToggleProps) {
  return (
    <div className="mt-4 border-t border-[var(--color-border)] pt-4">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          Kostnadskontroll
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">
          <span className="text-[var(--color-success)]">{counts.ok} OK</span>
          {' · '}
          <span className="text-[var(--color-danger)]">{counts.notOk} Not OK</span>
          {' · '}
          {counts.unset} ej granskade
        </span>
      </div>
      <div
        className="inline-flex flex-wrap rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-1"
        role="group"
        aria-label="Filtrera på kontrollstatus"
      >
        {OPTIONS.map((opt) => (
          <button
            key={opt.value || 'all'}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              'rounded-md px-3 py-1.5 text-sm font-medium transition',
              value === opt.value
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
            ].join(' ')}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
