export interface LogisticsRow {
  FO: string
  Datum: string
  Butiksnamn: string
  Butiksnr: string
  Typ: string
  Kostnad: string
  Mängd: number
  Summa: number
  RPU: number
  Pall: number
}

export type RowReviewStatus = 'ok' | 'not_ok'

export type ReviewFilter = '' | RowReviewStatus | 'unset'

export type RowReviews = Record<string, RowReviewStatus>

export interface FilterState {
  butiksnamn: string
  butiksnr: string
  typ: string
  kostnad: string
  datum: string
  kontroll: ReviewFilter
}

export interface DashboardKpis {
  totalRows: number
  totalSumma: number
  totalRpu: number
  totalPall: number
  summaFreightByRpu: number
  summaFuelSurcharge: number
  summaShunting: number
}

export interface GroupSummary {
  label: string
  summa: number
  pall?: number
}

export const EMPTY_FILTERS: FilterState = {
  butiksnamn: '',
  butiksnr: '',
  typ: '',
  kostnad: '',
  datum: '',
  kontroll: '',
}

export const REQUIRED_COLUMNS = [
  'Freight order / Service order',
  'Date',
  'Stage Destination location name',
  'Stage Destination location ID',
  'Means of transport',
  'Charge description',
  'Rate Amount',
  'Calculated amount',
  'Quantity',
] as const
