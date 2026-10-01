import { useNavigate } from 'react-router-dom'
import type { Recipe } from '../types'
import { DIFFICULTY_LABEL } from '../lib/options'
import { CATEGORY_TINT } from '../lib/ui'
import { ClockIcon, FlameIcon } from './icons'
import FavoriteButton from './favorites/FavoriteButton'
import { useAppStore } from '../store/useAppStore'

interface RecipeCardProps {
  recipe: Recipe
  index?: number
  badge?: string
}

export default function RecipeCard({ recipe, index = 0, badge }: RecipeCardProps) {
  const navigate = useNavigate()
  const favorited = useAppStore((s) => s.favorites.includes(recipe.id))
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)

  return (
    <div
      className="flip-in group relative w-full overflow-hidden rounded-card border border-white/10 bg-panel text-left transition-colors hover:border-accent/40"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        type="button"
        onClick={() => navigate(`/recipe/${recipe.id}`)}
        className="block w-full text-left"
      >
        <div
          className="flex h-24 items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${CATEGORY_TINT[recipe.category]}26, transparent)` }}
        >
          <span className="text-5xl drop-shadow-sm transition-transform duration-200 group-hover:scale-110">
            {recipe.emoji}
          </span>
        </div>
        <div className="p-3.5">
          <div className="mb-1 line-clamp-1 text-sm font-semibold text-ink">{recipe.name}</div>
          <div className="mb-2.5 flex items-baseline gap-1">
            <span className="text-lg font-bold tabular-nums text-accent">{recipe.calories}</span>
            <span className="text-xs text-dim">kcal</span>
          </div>
          <div className="flex items-center justify-between text-xs tabular-nums text-dim">
            <span>
              蛋白 {recipe.protein}g · 碳水 {recipe.carbs}g · 脂肪 {recipe.fat}g
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-3 text-xs text-dim">
            <span className="inline-flex items-center gap-1">
              <ClockIcon size={14} />
              {recipe.cookTime}分
            </span>
            <span className="inline-flex items-center gap-1">
              <FlameIcon size={14} />
              {DIFFICULTY_LABEL[recipe.difficulty]}
            </span>
          </div>
        </div>
      </button>

      {badge && (
        <span className="absolute left-2 top-2 rounded-full bg-accent/90 px-2 py-0.5 text-[11px] font-semibold text-emerald-950">
          {badge}
        </span>
      )}

      <FavoriteButton
        active={favorited}
        onToggle={() => toggleFavorite(recipe.id)}
        className="absolute right-2 top-2 z-10 bg-black/25 p-1.5 backdrop-blur-sm"
      />
    </div>
  )
}
