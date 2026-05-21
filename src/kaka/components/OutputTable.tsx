import { OUTPUT_COLUMNS, type OutputColumn } from '../constants'
import type { OutputRow } from '../types'

interface OutputTableProps {
  rows: OutputRow[]
  onCellChange: (rowIndex: number, column: OutputColumn, value: string) => void
  onDeleteRow: (rowIndex: number) => void
}

export function OutputTable({ rows, onCellChange, onDeleteRow }: OutputTableProps) {
  if (rows.length === 0) return null

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
              <th className="sticky left-0 z-10 min-w-[4rem] border-r border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2 py-2 font-medium text-[var(--color-text-muted)]">
                #
              </th>
              {OUTPUT_COLUMNS.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-2 py-2 font-medium text-[var(--color-text-muted)]"
                  title={col}
                >
                  {col}
                </th>
              ))}
              <th className="sticky right-0 min-w-[5rem] border-l border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2 py-2 font-medium text-[var(--color-text-muted)]">
                Åtgärd
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-elevated)]/50"
              >
                <td className="sticky left-0 z-10 border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] px-2 py-1 text-[var(--color-text-muted)]">
                  {rowIndex + 1}
                </td>
                {OUTPUT_COLUMNS.map((col) => (
                  <td key={col} className="p-0">
                    <input
                      type="text"
                      value={row[col]}
                      onChange={(e) => onCellChange(rowIndex, col, e.target.value)}
                      className="w-full min-w-[7rem] border-0 bg-transparent px-2 py-1.5 text-[var(--color-text)] outline-none focus:bg-[var(--color-accent-dim)] focus:ring-1 focus:ring-[var(--color-accent)]/50"
                    />
                  </td>
                ))}
                <td className="sticky right-0 border-l border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] px-2 py-1">
                  <button
                    type="button"
                    onClick={() => onDeleteRow(rowIndex)}
                    className="rounded px-2 py-1 text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/15"
                  >
                    Ta bort
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
