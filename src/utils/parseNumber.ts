/** Parse numeric values from Excel cells (comma decimals, spaces, currency). */
export function parseNumber(value: unknown): number {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  let str = String(value).trim()
  if (!str || str === '-' || str === '–') return 0

  str = str.replace(/\s/g, '')
  str = str.replace(/[^\d,.-]/g, '')

  const lastComma = str.lastIndexOf(',')
  const lastDot = str.lastIndexOf('.')

  if (lastComma > -1 && lastDot > -1) {
    if (lastComma > lastDot) {
      str = str.replace(/\./g, '').replace(',', '.')
    } else {
      str = str.replace(/,/g, '')
    }
  } else if (lastComma > -1) {
    const parts = str.split(',')
    if (parts.length === 2 && parts[1].length <= 2) {
      str = str.replace(',', '.')
    } else {
      str = str.replace(/,/g, '')
    }
  }

  const num = parseFloat(str)
  return Number.isFinite(num) ? num : 0
}
