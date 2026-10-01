import type { ReactNode } from 'react'
import { useAppStore } from '../store/useAppStore'
import { ALLERGEN_OPTIONS, AVOID_OPTIONS, CATEGORIES, CATEGORY_LABEL } from '../lib/options'
import type { Category } from '../types'
import Slider from '../components/Slider'
import Stepper from '../components/Stepper'
import Toggle from '../components/Toggle'
import Tag from '../components/Tag'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-card border border-white/10 bg-panel p-5">
      <h2 className="mb-4 text-sm font-semibold text-dim">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export default function Settings() {
  const constraints = useAppStore((s) => s.constraints)
  const setConstraints = useAppStore((s) => s.setConstraints)
  const resetConstraints = useAppStore((s) => s.resetConstraints)
  const favoriteRecommendEnabled = useAppStore((s) => s.favoriteRecommendEnabled)
  const setFavoriteRecommendEnabled = useAppStore((s) => s.setFavoriteRecommendEnabled)

  const {
    totalCaloriesMax,
    totalCaloriesMin,
    mealCalorieRanges,
    proteinMin,
    vegetarian,
    avoidAllergens,
    avoidIngredients,
    avoidDuplicateMainIngredient,
    requireProteinSource,
  } = constraints

  const toggleIn = (arr: string[], id: string) =>
    arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]

  const setRange = (cat: Category, idx: 0 | 1, val: number) => {
    const next = { ...mealCalorieRanges }
    const [lo, hi] = next[cat]
    next[cat] = idx === 0 ? [val, hi] : [lo, val]
    setConstraints({ mealCalorieRanges: next })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">抽签设置</h1>
        <p className="mt-1 text-sm text-dim">调整约束，下次抽取立即生效</p>
      </div>

      <Section title="热量与蛋白目标">
        <Slider
          label="总热量上限"
          value={totalCaloriesMax}
          min={totalCaloriesMin}
          max={2400}
          step={50}
          suffix="kcal"
          onChange={(v) => setConstraints({ totalCaloriesMax: v })}
        />
        <Slider
          label="总热量下限"
          value={totalCaloriesMin}
          min={800}
          max={totalCaloriesMax}
          step={50}
          suffix="kcal"
          onChange={(v) => setConstraints({ totalCaloriesMin: v })}
        />
        <Slider
          label="蛋白质下限"
          value={proteinMin}
          min={30}
          max={120}
          step={5}
          suffix="g"
          onChange={(v) => setConstraints({ proteinMin: v })}
        />
      </Section>

      <Section title="单餐热量区间">
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const [lo, hi] = mealCalorieRanges[cat]
            return (
              <div key={cat} className="rounded-lg border border-white/5 bg-panel2/40 p-3">
                <div className="mb-2 text-xs font-medium text-ink">{CATEGORY_LABEL[cat]}</div>
                <div className="grid grid-cols-2 gap-4">
                  <Stepper
                    label="最低"
                    value={lo}
                    min={50}
                    max={hi}
                    step={50}
                    suffix=" kcal"
                    onChange={(v) => setRange(cat, 0, v)}
                  />
                  <Stepper
                    label="最高"
                    value={hi}
                    min={lo}
                    max={1200}
                    step={50}
                    suffix=" kcal"
                    onChange={(v) => setRange(cat, 1, v)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      <Section title="饮食偏好">
        <Toggle
          label="素食"
          description="只抽取不含肉类的菜谱"
          checked={vegetarian}
          onChange={(v) => setConstraints({ vegetarian: v })}
        />
        <Toggle
          label="食材去重"
          description="三餐避免重复同类主食材"
          checked={avoidDuplicateMainIngredient}
          onChange={(v) => setConstraints({ avoidDuplicateMainIngredient: v })}
        />
        <Toggle
          label="荤素搭配"
          description="早/午/晚至少一份优质蛋白"
          checked={requireProteinSource}
          onChange={(v) => setConstraints({ requireProteinSource: v })}
        />
      </Section>

      <Section title="忌口过敏原">
        <div className="flex flex-wrap gap-2">
          {ALLERGEN_OPTIONS.map((o) => (
            <Tag
              key={o.id}
              label={o.label}
              active={avoidAllergens.includes(o.id)}
              onClick={() => setConstraints({ avoidAllergens: toggleIn(avoidAllergens, o.id) })}
            />
          ))}
        </div>
      </Section>

      <Section title="不吃这些食材">
        <div className="flex flex-wrap gap-2">
          {AVOID_OPTIONS.map((o) => (
            <Tag
              key={o.id}
              label={o.label}
              active={avoidIngredients.includes(o.id)}
              onClick={() => setConstraints({ avoidIngredients: toggleIn(avoidIngredients, o.id) })}
            />
          ))}
        </div>
      </Section>

      <Section title="收藏">
        <Toggle
          label="收藏不足时推荐菜品"
          description="收藏少于 5 道时，用系统推荐补充菜单选择"
          checked={favoriteRecommendEnabled}
          onChange={setFavoriteRecommendEnabled}
        />
      </Section>

      <button
        type="button"
        onClick={resetConstraints}
        className="w-full rounded-card border border-white/10 py-3 text-sm text-dim transition-colors hover:text-ink"
      >
        恢复默认设置
      </button>
    </div>
  )
}
