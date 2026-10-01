import type { Totals } from '../types'

const MACROS = [
  { key: 'protein', label: '蛋白质', color: '#34d399', kcalPerG: 4 },
  { key: 'carbs', label: '碳水', color: '#60a5fa', kcalPerG: 4 },
  { key: 'fat', label: '脂肪', color: '#fbbf24', kcalPerG: 9 },
] as const

export default function MacroBars({ totals }: { totals: Totals }) {
  const grams: Record<(typeof MACROS)[number]['key'], number> = {
    protein: totals.protein,
    carbs: totals.carbs,
    fat: totals.fat,
  }
  const kcal = MACROS.map((m) => grams[m.key] * m.kcalPerG)
  const totalKcal = kcal.reduce((a, b) => a + b, 0) || 1

  return (
    <div className="space-y-3">
      {MACROS.map((m, i) => {
        const pct = Math.round((kcal[i] / totalKcal) * 100)
        return (
          <div key={m.key}>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="flex items-center gap-2 text-xs text-dim">
                <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                {m.label}
              </span>
              <span className="text-xs text-dim">
                <span className="text-sm font-semibold tabular-nums text-ink">{grams[m.key]}</span>
                g · {pct}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel2">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${pct}%`, background: m.color }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
