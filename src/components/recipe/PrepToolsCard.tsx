import type { Recipe } from '../../types'

export default function PrepToolsCard({ recipe }: { recipe: Recipe }) {
  const hasTools = recipe.tools && recipe.tools.length > 0
  const hasPrep = recipe.prep && recipe.prep.length > 0
  if (!hasTools && !hasPrep) return null

  return (
    <section className="fade-up rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(120,96,66,0.06)]">
      {hasPrep && (
        <div className="mb-4 last:mb-0">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-[#3b2f25]">
            <span>🫕</span> 预处理
          </h3>
          <ul className="space-y-1.5">
            {recipe.prep!.map((p, i) => (
              <li key={i} className="flex items-baseline gap-2 text-sm text-[#5b4f43]">
                <span className="text-[#d98e5f]">•</span>
                <span>{p.action}</span>
                {p.duration !== undefined && (
                  <span className="text-xs text-[#9a8b78]">（约 {p.duration} 分钟）</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasTools && (
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-[#3b2f25]">
            <span>🔪</span> 所需工具
          </h3>
          <div className="flex flex-wrap gap-2">
            {recipe.tools!.map((t, i) => (
              <span
                key={i}
                className="rounded-lg bg-[#faf3e8] px-3 py-1.5 text-sm text-[#5b4f43]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
