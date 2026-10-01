import type { Ingredient, Recipe } from '../../types'
import { formatAmount, splitIngredients } from '../../lib/recipeContent'

function Row({ ing }: { ing: Ingredient }) {
  const isSub = ing.type === '可选替换'
  return (
    <li
      className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${
        isSub ? 'rounded-lg border border-dashed border-[#e0c9b0] px-2' : ''
      }`}
    >
      <span className="min-w-0 text-[#3b2f25]">
        <span className="font-medium">{ing.name}</span>
        {ing.prep && <span className="ml-1.5 text-xs text-[#9a8b78]">{ing.prep}</span>}
        {isSub && (
          <span className="ml-1.5 rounded bg-[#f4e9dc] px-1.5 py-0.5 text-[10px] text-[#b07a45]">
            可替换
          </span>
        )}
        {ing.note && <span className="ml-1.5 text-xs text-[#9a8b78]">{ing.note}</span>}
      </span>
      <span className="shrink-0 whitespace-nowrap text-[#5b4f43]">{formatAmount(ing)}</span>
    </li>
  )
}

function Group({ title, items }: { title: string; items: Ingredient[] }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 text-xs font-semibold tracking-wide text-[#d98e5f]">{title}</div>
      <ul className="divide-y divide-[#f0e4d5]">
        {items.map((it, i) => (
          <Row key={`${it.name}-${i}`} ing={it} />
        ))}
      </ul>
    </div>
  )
}

export default function IngredientsPanel({ recipe }: { recipe: Recipe }) {
  const { foods, seasonings } = splitIngredients(recipe)

  return (
    <div className="fade-up recipe-card flex h-full flex-col p-5">
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-[#3b2f25]">
        <span>🧺</span> 食材与调料
      </h2>

      <div className="flex-1">
        <Group title="食材" items={foods} />
        {seasonings.length > 0 && <Group title="调料" items={seasonings} />}
      </div>

      <div className="mt-3 border-t border-[#f0e4d5] pt-3 text-[11px] leading-relaxed text-[#a2917d]">
        <p>1 汤匙 ≈ 15 毫升 · 1 茶匙 ≈ 5 毫升 · 1 克盐 ≈ 1 小撮</p>
        <p className="mt-1">克数与时长为参考值</p>
      </div>
    </div>
  )
}
