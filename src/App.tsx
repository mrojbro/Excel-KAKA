import { useCallback, useMemo, useState } from 'react'
import { Charts } from './components/Charts'
import { CostTable } from './components/CostTable'
import { DashboardCards } from './components/DashboardCards'
import { FileUpload } from './components/FileUpload'
import { Filters } from './components/Filters'
import { SummarySection } from './components/SummarySection'
import {
  EMPTY_FILTERS,
  type FilterState,
  type LogisticsRow,
  type RowReviewStatus,
  type RowReviews,
} from './types'
import {
  computeKpis,
  groupBySumma,
  groupPallByDatum,
} from './utils/aggregations'
import { parseExcelFile } from './utils/excelParser'
import { applyFilters } from './utils/filterRows'
import { applyReviewFilter } from './utils/reviewFilter'

export default function App() {
  const [allRows, setAllRows] = useState<LogisticsRow[]>([])
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [missingColumns, setMissingColumns] = useState<string[]>([])
  const [sheetName, setSheetName] = useState<string | null>(null)
  const [rowReviews, setRowReviews] = useState<RowReviews>({})

  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)
    setMissingColumns([])
    setFileName(file.name)

    try {
      const result = await parseExcelFile(file)
      setSheetName(result.sheetName)
      setMissingColumns(result.missingColumns)

      if (result.missingColumns.length > 0) {
        setAllRows([])
        setError(
          `Saknade obligatoriska kolumner: ${result.missingColumns.join(', ')}`,
        )
        return
      }

      if (result.rows.length === 0) {
        setAllRows([])
        setError('Inga giltiga rader hittades efter filtrering.')
        return
      }

      setAllRows(result.rows)
      setFilters(EMPTY_FILTERS)
      setRowReviews({})
    } catch (err) {
      setAllRows([])
      setError(err instanceof Error ? err.message : 'Kunde inte läsa Excel-filen.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const filteredRows = useMemo(
    () => applyFilters(allRows, filters),
    [allRows, filters],
  )

  const tableRows = useMemo(
    () => applyReviewFilter(filteredRows, rowReviews, filters.kontroll),
    [filteredRows, rowReviews, filters.kontroll],
  )

  const handleReviewChange = useCallback(
    (rowKey: string, status: RowReviewStatus | undefined) => {
      setRowReviews((prev) => {
        const next = { ...prev }
        if (status) next[rowKey] = status
        else delete next[rowKey]
        return next
      })
    },
    [],
  )

  const kpis = useMemo(() => computeKpis(filteredRows), [filteredRows])

  const summaByDatum = useMemo(
    () => groupBySumma(filteredRows, 'Datum'),
    [filteredRows],
  )
  const summaByTyp = useMemo(() => groupBySumma(filteredRows, 'Typ'), [filteredRows])
  const summaByKostnad = useMemo(
    () => groupBySumma(filteredRows, 'Kostnad'),
    [filteredRows],
  )
  const pallByDatum = useMemo(
    () => groupPallByDatum(filteredRows),
    [filteredRows],
  )

  const hasData = allRows.length > 0

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Logistik Kostnadskontroll
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Ladda upp en Excel-export för att analysera fraktkostnader — 100 % lokalt i
            webbläsaren
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
        <FileUpload
          onFileSelect={handleFileSelect}
          isLoading={isLoading}
          fileName={fileName}
        />

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)]"
          >
            {error}
          </div>
        )}

        {missingColumns.length > 0 && !error && (
          <div
            role="alert"
            className="rounded-xl border border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10 px-4 py-3 text-sm text-[var(--color-warning)]"
          >
            Varning: saknade kolumner — {missingColumns.join(', ')}
          </div>
        )}

        {sheetName && hasData && (
          <p className="text-xs text-[var(--color-text-muted)]">
            Aktivt ark: <span className="text-[var(--color-text)]">{sheetName}</span>
          </p>
        )}

        {hasData && (
          <>
            <DashboardCards kpis={kpis} />

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              <SummarySection
                title="Summa per Datum"
                items={summaByDatum}
                valueKey="summa"
                recentWindow
              />
              <SummarySection title="Summa per Typ" items={summaByTyp} valueKey="summa" />
              <SummarySection
                title="Summa per Kostnad"
                items={summaByKostnad}
                valueKey="summa"
              />
              <SummarySection
                title="Pall per Datum (Freight by RPU)"
                items={pallByDatum}
                valueKey="pall"
                recentWindow
              />
            </div>

            <Charts
              summaByDatum={summaByDatum}
              summaByTyp={summaByTyp}
              summaByKostnad={summaByKostnad}
              pallByDatum={pallByDatum}
            />

            <Filters
              filters={filters}
              onChange={setFilters}
              allRows={allRows}
              excelFilteredRows={filteredRows}
              tableRowCount={tableRows.length}
              rowReviews={rowReviews}
            />

            <CostTable
              rows={tableRows}
              rowReviews={rowReviews}
              onReviewChange={handleReviewChange}
            />
          </>
        )}

        {!hasData && !isLoading && !error && (
          <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-8 text-center">
            <h2 className="text-lg font-medium text-[var(--color-text)]">
              Kom igång
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--color-text-muted)]">
              Exportera din logistikrapport som .xlsx eller .xls. Dashboarden mappar
              kolumner automatiskt, filtrerar bort subtotal-rader och butiker utan giltigt
              butiksnummer, och beräknar Pall som RPU ÷ 1,7.
            </p>
            <ul className="mx-auto mt-4 max-w-md space-y-1 text-left text-sm text-[var(--color-text-muted)]">
              <li>• FO — Freight order / Service order</li>
              <li>• Datum, Butiksnamn, Butiksnr, Typ, Kostnad</li>
              <li>• Mängd, Summa, RPU + beräknad Pall</li>
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
