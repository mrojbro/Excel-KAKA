import type { GroupSummary } from '../types'
import { formatCurrency, formatPall } from '../utils/format'

interface SummarySectionProps {
  title: string
  items: GroupSummary[]
  valueKey: 'summa' | 'pall'
  limit?: number
  /** When true, show the most recent N items (for chronological date series). */
  recentWindow?: boolean
}

export function SummarySection({
  title,
  items,
  valueKey,
  limit = 15,
  recentWindow = false,
}: SummarySectionProps) {
  const top = recentWindow ? items.slice(-limit) : items.slice(0, limit)

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {title}
      </h3>
      <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {top.length === 0 ? (
          <li className="text-sm text-[var(--color-text-muted)]">Ingen data</li>
        ) : (
          top.map((item) => {
            const value = valueKey === 'summa' ? item.summa : (item.pall ?? 0)
            const max = top[0]
              ? valueKey === 'summa'
                ? top[0].summa
                : (top[0].pall ?? 1)
              : 1
            const pct = max > 0 ? (value / max) * 100 : 0
            return (
              <li key={item.label}>
                <div className="mb-1 flex justify-between gap-2 text-sm">
                  <span className="truncate text-[var(--color-text)]" title={item.label}>
                    {item.label}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums text-[var(--color-accent)]">
                    {valueKey === 'summa' ? formatCurrency(value) : formatPall(value)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)]/70"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            )
          })
        )}
      </ul>
    </section>
  )
}
