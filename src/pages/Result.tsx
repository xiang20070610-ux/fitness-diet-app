import { useAppStore } from '../store/useAppStore'
import { CATEGORIES } from '../lib/options'
import MealSlotCard from '../components/MealSlotCard'
import MacroBars from '../components/MacroBars'
import CountUp from '../components/CountUp'
import { DiceIcon } from '../components/icons'

export default function Result() {
  const slots = useAppStore((s) => s.slots)
  const locked = useAppStore((s) => s.locked)
  const totals = useAppStore((s) => s.totals)
  const drawError = useAppStore((s) => s.drawError)
  const hasDrawn = useAppStore((s) => s.hasDrawn)
  const drawAll = useAppStore((s) => s.drawAll)
  const redrawOne = useAppStore((s) => s.redrawOne)
  const toggleLock = useAppStore((s) => s.toggleLock)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">抽取结果</h1>
        <p className="mt-1 text-sm text-dim">锁定喜欢的，重抽其余的</p>
      </div>

      {hasDrawn && (
        <section className="rounded-card border border-white/10 bg-panel p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs text-dim">四餐合计热量</div>
              <div className="mt-1 text-4xl font-bold tabular-nums text-accent">
                <CountUp value={totals.calories} />
                <span className="ml-1 text-sm font-normal text-dim">kcal</span>
              </div>
            </div>
            <div className="text-right text-xs tabular-nums text-dim">
              <div>蛋白 {totals.protein}g</div>
              <div className="mt-1">
                碳水 {totals.carbs}g · 脂肪 {totals.fat}g
              </div>
            </div>
          </div>
          <div className="mt-4">
            <MacroBars totals={totals} />
          </div>
        </section>
      )}

      {drawError && (
        <section className="rounded-card border border-amber-500/30 bg-amber-500/5 p-5">
          <h2 className="text-sm font-semibold text-amber-400">⚠️ {drawError.message}</h2>
          <ul className="mt-3 space-y-2">
            {drawError.suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-dim">
                <span className="text-amber-400">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat, i) => (
          <MealSlotCard
            key={cat}
            category={cat}
            recipe={slots[cat]}
            locked={Boolean(locked[cat])}
            onToggleLock={() => toggleLock(cat)}
            onRedraw={() => redrawOne(cat)}
            index={i}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={drawAll}
        className="flex w-full items-center justify-center gap-2 rounded-card bg-accent py-4 text-base font-bold text-emerald-950 transition-transform active:scale-[0.98]"
      >
        <DiceIcon size={20} />
        重新抽取全部
      </button>
    </div>
  )
}
