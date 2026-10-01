import type { Recipe } from '../../types'
import { CATEGORY_LABEL, DIFFICULTY_LABEL } from '../../lib/options'
import { recipeDescription } from '../../lib/recipeContent'

function Pill({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4e9dc] px-3 py-1 text-xs font-medium text-[#7a5b3f]">
      <span>{icon}</span>
      {label}
    </span>
  )
}

export default function RecipeHero({ recipe }: { recipe: Recipe }) {
  const pending = recipe.source.reviewStatus === 'pending'

  return (
    <header className="fade-up">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-[#d98e5f]">{CATEGORY_LABEL[recipe.category]}</span>
        {pending && (
          <span className="rounded-full bg-[#f7e3c9] px-2.5 py-0.5 text-[11px] font-medium text-[#b07a45]">
            待审核
          </span>
        )}
      </div>

      <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#3b2f25]">
        {recipe.name}
      </h1>
      <p className="mt-2.5 text-[15px] leading-relaxed text-[#5b4f43]">
        {recipeDescription(recipe)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Pill icon="🔥" label={`${recipe.calories} 千卡`} />
        <Pill icon="⏱️" label={`${recipe.cookTime} 分钟`} />
        <Pill icon="👨‍🍳" label={`难度 · ${DIFFICULTY_LABEL[recipe.difficulty]}`} />
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-[#a2917d]">
        营养数据依据《中国食物成分表》计算 · 克数与时长为经验参考值
        {pending && ' · 内容由 AI 生成，待人工审核'}
      </p>
    </header>
  )
}
