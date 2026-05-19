import type { LogisticsRow, ReviewFilter, RowReviews } from '../types'
import { getRowKey } from './rowKey'

export function getRowReview(
  row: LogisticsRow,
  reviews: RowReviews,
): RowReviews[string] | undefined {
  return reviews[getRowKey(row)]
}

export function applyReviewFilter(
  rows: LogisticsRow[],
  reviews: RowReviews,
  kontroll: ReviewFilter,
): LogisticsRow[] {
  if (!kontroll) return rows

  return rows.filter((row) => {
    const status = getRowReview(row, reviews)
    if (kontroll === 'unset') return !status
    return status === kontroll
  })
}

export function countReviews(
  rows: LogisticsRow[],
  reviews: RowReviews,
): { ok: number; notOk: number; unset: number } {
  let ok = 0
  let notOk = 0
  let unset = 0

  for (const row of rows) {
    const status = getRowReview(row, reviews)
    if (status === 'ok') ok++
    else if (status === 'not_ok') notOk++
    else unset++
  }

  return { ok, notOk, unset }
}
