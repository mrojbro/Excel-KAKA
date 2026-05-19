import type { RowReviewStatus } from '../types'

interface RowStatusButtonsProps {
  status?: RowReviewStatus
  onChange: (status: RowReviewStatus | undefined) => void
}

export function RowStatusButtons({ status, onChange }: RowStatusButtonsProps) {
  const setStatus = (next: RowReviewStatus) => {
    onChange(status === next ? undefined : next)
  }

  return (
    <div className="inline-flex rounded-lg border border-[var(--color-border)] p-0.5">
      <button
        type="button"
        onClick={() => setStatus('ok')}
        className={[
          'rounded-md px-2.5 py-1 text-xs font-medium transition',
          status === 'ok'
            ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-success)]',
        ].join(' ')}
        aria-pressed={status === 'ok'}
      >
        OK
      </button>
      <button
        type="button"
        onClick={() => setStatus('not_ok')}
        className={[
          'rounded-md px-2.5 py-1 text-xs font-medium transition',
          status === 'not_ok'
            ? 'bg-[var(--color-danger)]/20 text-[var(--color-danger)]'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-danger)]',
        ].join(' ')}
        aria-pressed={status === 'not_ok'}
      >
        Not OK
      </button>
    </div>
  )
}
