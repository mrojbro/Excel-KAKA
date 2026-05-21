import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { GroupSummary } from '../types'
import { formatChartLabel, formatCurrency, formatPall } from '../utils/format'

const CHART_COLORS = [
  '#58a6ff',
  '#3fb950',
  '#d29922',
  '#f778ba',
  '#a371f7',
  '#39c5cf',
  '#ff7b72',
  '#79c0ff',
]

const CHART_HEIGHT = 240

interface ChartCardProps {
  title: string
  data: GroupSummary[]
  dataKey: 'summa' | 'pall'
  recentWindow?: boolean
}

function truncateLabel(label: string, max = 18): string {
  return label.length > max ? `${label.slice(0, max)}…` : label
}

function CustomTooltip({
  active,
  payload,
  dataKey,
}: {
  active?: boolean
  payload?: { payload: GroupSummary }[]
  dataKey: 'summa' | 'pall'
}) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  const value = dataKey === 'summa' ? item.summa : (item.pall ?? 0)
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-[var(--color-text)]">{item.label}</p>
      <p className="text-[var(--color-accent)]">
        {dataKey === 'summa' ? formatCurrency(value) : formatPall(value)}
      </p>
    </div>
  )
}

function ChartCard({ title, data, dataKey, recentWindow = false }: ChartCardProps) {
  const top = recentWindow ? data.slice(-12) : data.slice(0, 12)
  const chartData = top.map((d) => ({
    ...d,
    shortLabel: truncateLabel(d.label),
    value: dataKey === 'summa' ? d.summa : (d.pall ?? 0),
  }))

  const formatValue = (value: number) => formatChartLabel(value, dataKey)

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {title}
      </h3>
      {chartData.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--color-text-muted)]">Ingen data</p>
      ) : (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={chartData} margin={{ top: 32, right: 8, left: 0, bottom: 48 }}>
            <XAxis
              dataKey="shortLabel"
              tick={{ fill: '#8b949e', fontSize: 11 }}
              angle={-35}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis
              tick={{ fill: '#8b949e', fontSize: 11 }}
              tickFormatter={(v) =>
                dataKey === 'summa'
                  ? `${(Number(v) / 1000).toFixed(0)}k`
                  : String(v)
              }
            />
            <Tooltip content={<CustomTooltip dataKey={dataKey} />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value: number | string) => formatValue(Number(value))}
                style={{ fill: '#e6edf3', fontSize: 11, fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}

interface ChartsProps {
  summaByDatum: GroupSummary[]
  summaByTyp: GroupSummary[]
  summaByKostnad: GroupSummary[]
  pallByDatum: GroupSummary[]
}

export function Charts({
  summaByDatum,
  summaByTyp,
  summaByKostnad,
  pallByDatum,
}: ChartsProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <ChartCard
        title="Summa per Datum"
        data={summaByDatum}
        dataKey="summa"
        recentWindow
      />
      <ChartCard title="Summa per Typ" data={summaByTyp} dataKey="summa" />
      <ChartCard title="Summa per Kostnad" data={summaByKostnad} dataKey="summa" />
      <ChartCard
        title="Pall per Datum (Freight by RPU)"
        data={pallByDatum}
        dataKey="pall"
        recentWindow
      />
    </div>
  )
}
