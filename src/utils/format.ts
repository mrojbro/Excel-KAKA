const currencyFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat('sv-SE', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

const pallFormatter = new Intl.NumberFormat('sv-SE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatNumber(value: number, decimals = 2): string {
  if (decimals === 2) {
    return new Intl.NumberFormat('sv-SE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }
  return numberFormatter.format(value)
}

export function formatPall(value: number): string {
  return pallFormatter.format(value)
}

/** Compact labels for chart bars and pie segments. */
export function formatChartLabel(value: number, type: 'summa' | 'pall'): string {
  if (type === 'summa') {
    if (value >= 1_000_000) {
      return `${new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1 }).format(value / 1_000_000)}M kr`
    }
    if (value >= 10_000) {
      return `${new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 }).format(value / 1000)}k kr`
    }
    return formatCurrency(value)
  }
  if (value >= 1000) {
    return `${new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 }).format(value / 1000)}k`
  }
  return formatPall(value)
}
