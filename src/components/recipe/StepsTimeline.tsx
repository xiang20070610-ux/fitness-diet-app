import type { Recipe } from '../../types'
import { stepEmoji } from '../../lib/recipeContent'
import DishImage from '../DishImage'

export default function StepsTimeline({ recipe }: { recipe: Recipe }) {
  const prepTime = recipe.prepTime ?? 0
  const total = prepTime + recipe.cookTime

  return (
    <section className="fade-up">
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-[#3b2f25]">
        <span>📋</span> 制作步骤
      </h2>

      {/* 总耗时汇总 */}
      <div className="mb-5 rounded-2xl bg-[#fbf0e0] px-4 py-3 text-sm text-[#6b5a45]">
        {prepTime > 0 ? (
          <>
            准备 <b className="text-[#3b2f25]">{prepTime}</b> 分钟 + 烹饪{' '}
            <b className="text-[#3b2f25]">{recipe.cookTime}</b> 分钟 ≈ 总耗时{' '}
            <b className="text-[#d98e5f]">{total}</b> 分钟
          </>
        ) : (
          <>
            总耗时 <b className="text-[#d98e5f]">{total}</b> 分钟
          </>
        )}
        <span className="ml-2 text-[11px] text-[#a2917d]">（时长为参考值）</span>
      </div>

      <ol className="space-y-3">
        {recipe.steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            {/* 序号与连线 */}
            <div className="flex flex-col items-center">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d98e5f] text-sm font-bold text-white">
                {s.order}
              </span>
              {i < recipe.steps.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-[#ecd9c3]" />
              )}
            </div>

            {/* 步骤卡片 */}
            <div className="mb-1 flex-1 rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(120,96,66,0.06)]">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0">
                  <DishImage
                    src={s.image}
                    emoji={stepEmoji(s.action, i)}
                    alt={`步骤 ${s.order}`}
                    ratio="square"
                    rounded="rounded-xl"
                    className="h-12 w-12"
                    emojiClassName="text-xl"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-[#3b2f25]">{s.action}</p>
                  {(s.duration !== undefined || s.heat) && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {s.duration !== undefined && (
                        <span className="rounded-full bg-[#f4e9dc] px-2 py-0.5 text-[11px] text-[#7a5b3f]">
                          ⏱️ {s.duration} 分钟
                        </span>
                      )}
                      {s.heat && (
                        <span className="rounded-full bg-[#f4e9dc] px-2 py-0.5 text-[11px] text-[#7a5b3f]">
                          🔥 {s.heat}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {s.doneWhen && (
                <p className="mt-2.5 text-xs leading-relaxed text-[#d98e5f]">
                  ✅ 判断：{s.doneWhen}
                </p>
              )}
              {s.tip && (
                <p className="mt-1.5 text-xs leading-relaxed text-[#a2917d]">💡 {s.tip}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
