export const PALL_DIVISOR = 1.7

export const FREIGHT_BY_RPU_KOSTNAD = 'Freight by RPU'
export const FUEL_SURCHARGE_KOSTNAD = 'Fuel Surcharge %'
export const SHUNTING_KOSTNAD = 'Shunting'

export function isKostnadType(kostnad: string, expected: string): boolean {
  return kostnad.trim().toLowerCase() === expected.toLowerCase()
}

export function isFreightByRpuKostnad(kostnad: string): boolean {
  return isKostnadType(kostnad, FREIGHT_BY_RPU_KOSTNAD)
}

/** Pall = RPU / 1.7 */
export function calculatePall(rpu: number): number {
  if (!Number.isFinite(rpu)) return 0
  return rpu / PALL_DIVISOR
}
