const BADGE_COLORS = [
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-orange-500/20 text-orange-300 border-orange-500/30',
]

export function typBadgeClass(typ: string): string {
  let hash = 0
  for (let i = 0; i < typ.length; i++) {
    hash = typ.charCodeAt(i) + ((hash << 5) - hash)
  }
  return BADGE_COLORS[Math.abs(hash) % BADGE_COLORS.length]
}
