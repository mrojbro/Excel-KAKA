import type { DashboardKpis } from '../types'
import { formatCurrency, formatNumber, formatPall } from '../utils/format'

interface DashboardCardsProps {
  kpis: DashboardKpis
}

const cards: {
  key: keyof DashboardKpis
  label: string
  format: (v: number) => string
  accent?: string
}[] = [
  { key: 'totalRows', label: 'Antal rader', format: (v) => formatNumber(v, 0) },
  { key: 'totalSumma', label: 'Total Summa', format: formatCurrency, accent: 'text-[var(--color-accent)]' },
  { key: 'totalRpu', label: 'Total RPU', format: (v) => formatNumber(v) },
  { key: 'totalPall', label: 'Total Pall', format: formatPall },
  { key: 'summaFreightByRpu', label: 'Freight by RPU', format: formatCurrency },
  { key: 'summaFuelSurcharge', label: 'Fuel Surcharge %', format: formatCurrency },
  { key: 'summaShunting', label: 'Shunting', format: formatCurrency },
]

export function DashboardCards({ kpis }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map(({ key, label, format, accent }) => (
        <div
          key={key}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-4"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            {label}
          </p>
          <p className={`mt-2 text-xl font-semibold tabular-nums ${accent ?? 'text-[var(--color-text)]'}`}>
            {format(kpis[key])}
          </p>
        </div>
      ))}
    </div>
  )
}
