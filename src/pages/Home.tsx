import { useAppStore } from '../store/useAppStore'
import { CATEGORIES } from '../lib/options'
import RecipeCard from '../components/RecipeCard'
import ProgressRing from '../components/ProgressRing'
import MacroBars from '../components/MacroBars'
import CountUp from '../components/CountUp'
import { DiceIcon } from '../components/icons'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 5) return '夜深了'
  if (h < 11) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

export default function Home() {
  const constraints = useAppStore((s) => s.constraints)
  const slots = useAppStore((s) => s.recommendation)
  const totals = useAppStore((s) => s.recommendationTotals)
  const hasDrawn = useAppStore((s) => s.hasRecommendation)
  const error = useAppStore((s) => s.recommendationError)
  const draw = useAppStore((s) => s.drawRecommendation)

  const today = new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
  const ratio = hasDrawn ? totals.calories / constraints.totalCaloriesMax : 0
  const remaining = constraints.totalCaloriesMax - totals.calories

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-dim">{greeting()}</p>
        <h1 className="mt-1 text-xl font-bold text-ink">{today}</h1>
      </div>

      <section className="rounded-card border border-white/10 bg-panel p-6">
        <div className="flex items-center gap-6">
          <ProgressRing value={ratio} size={150} stroke={12}>
            <span className="text-xs text-dim">{hasDrawn ? '已摄入' : '今日'}</span>
            <span className="text-3xl font-bold tabular-nums text-ink">
              <CountUp value={totals.calories} />
            </span>
            <span className="text-xs text-dim">/ {constraints.totalCaloriesMax} kcal</span>
          </ProgressRing>
          <div className="flex-1">
            <div className="text-sm text-dim">
              今日热量预算 {constraints.totalCaloriesMin}–{constraints.totalCaloriesMax} kcal
            </div>
            <div className="mt-1 text-lg font-semibold text-ink">
              {remaining >= 0 ? '还可摄入' : '已超出'}
            </div>
            <div className="text-2xl font-bold tabular-nums text-accent">
              <CountUp value={Math.abs(remaining)} />
              <span className="ml-1 text-xs font-normal text-dim">kcal</span>
            </div>
            <div className="mt-3 text-xs tabular-nums text-dim">
              蛋白 {totals.protein}g · 碳水 {totals.carbs}g · 脂肪 {totals.fat}g
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={draw}
        className="flex w-full items-center justify-center gap-2 rounded-card bg-accent py-4 text-base font-bold text-emerald-950 transition-transform active:scale-[0.98]"
      >
        <DiceIcon size={20} />
        一键抽取今日推荐餐单
      </button>

      {error && (
        <section className="rounded-card border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold text-amber-400">⚠️ {error.message}</p>
          <ul className="mt-2 space-y-1">
            {error.suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-xs text-dim">
                <span className="text-amber-400">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasDrawn ? (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-dim">今日推荐餐单</h2>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat, i) => {
              const r = slots[cat]
              return r ? <RecipeCard key={cat} recipe={r} index={i} /> : null
            })}
          </div>
        </section>
      ) : (
        <section className="rounded-card border border-dashed border-white/10 p-8 text-center">
          <p className="text-sm text-dim">还没有今日推荐餐单</p>
          <p className="mt-1 text-xs text-dim">点击上方按钮，一键决定三餐+点心</p>
        </section>
      )}

      {hasDrawn && (
        <section className="rounded-card border border-white/10 bg-panel p-5">
          <h2 className="mb-4 text-sm font-semibold text-dim">营养小结</h2>
          <MacroBars totals={totals} />
        </section>
      )}
    </div>
  )
}
