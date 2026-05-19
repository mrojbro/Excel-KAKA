/** Convert Excel / string dates to yyyy-mm-dd. */
export function parseDate(value: unknown): string {
  if (value === null || value === undefined || value === '') return ''

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatYmd(value)
  }

  if (typeof value === 'number' && value > 0) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30))
    const date = new Date(excelEpoch.getTime() + value * 86400000)
    if (!Number.isNaN(date.getTime())) return formatYmd(date)
  }

  const str = String(value).trim()
  if (!str) return ''

  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`

  const dmy = str.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)
  if (dmy) {
    const day = dmy[1].padStart(2, '0')
    const month = dmy[2].padStart(2, '0')
    return `${dmy[3]}-${month}-${day}`
  }

  const ymd = str.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/)
  if (ymd) {
    return `${ymd[1]}-${ymd[2].padStart(2, '0')}-${ymd[3].padStart(2, '0')}`
  }

  const parsed = new Date(str)
  if (!Number.isNaN(parsed.getTime())) return formatYmd(parsed)

  return str
}

function formatYmd(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
