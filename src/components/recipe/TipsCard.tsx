import type { Recipe } from '../../types'
import { recipeTips } from '../../lib/recipeContent'

export default function TipsCard({ recipe }: { recipe: Recipe }) {
  const tips = recipeTips(recipe)

  return (
    <section className="fade-up rounded-2xl bg-[#fbf0e0] p-5">
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-[#3b2f25]">
        <span>💡</span> 小贴士
      </h2>
      <ul className="space-y-2">
        {tips.map((t, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-[#6b5a45]">
            <span className="mt-0.5 text-[#d98e5f]">•</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
