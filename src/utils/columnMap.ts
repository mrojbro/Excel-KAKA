/** Map Excel header names (normalized) to internal field keys. */
export const COLUMN_ALIASES: Record<string, string> = {
  'freight order / service order': 'FO',
  'freight order/service order': 'FO',
  'freight order': 'FO',
  'service order': 'FO',
  date: 'Datum',
  'stage destination location name': 'Butiksnamn',
  'stage destination location id': 'Butiksnr',
  'means of transport': 'Typ',
  'charge description': 'Kostnad',
  'rate amount': 'Mängd',
  'calculated amount': 'Summa',
  quantity: 'RPU',
}

export const EXCEL_TO_DISPLAY: Record<string, string> = {
  FO: 'Freight order / Service order',
  Datum: 'Date',
  Butiksnamn: 'Stage Destination location name',
  Butiksnr: 'Stage Destination location ID',
  Typ: 'Means of transport',
  Kostnad: 'Charge description',
  Mängd: 'Rate Amount',
  Summa: 'Calculated amount',
  RPU: 'Quantity',
}

export function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function mapHeaderToField(header: string): string | null {
  const normalized = normalizeHeader(header)
  return COLUMN_ALIASES[normalized] ?? null
}

export function findMissingColumns(headers: string[]): string[] {
  const found = new Set<string>()
  for (const h of headers) {
    const field = mapHeaderToField(h)
    if (field) found.add(field)
  }
  const requiredFields = ['FO', 'Datum', 'Butiksnamn', 'Butiksnr', 'Typ', 'Kostnad', 'Mängd', 'Summa', 'RPU']
  return requiredFields
    .filter((f) => !found.has(f))
    .map((f) => EXCEL_TO_DISPLAY[f] ?? f)
}
