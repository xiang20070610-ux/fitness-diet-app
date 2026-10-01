import { useNavigate } from 'react-router-dom'
import type { Category, Recipe } from '../types'
import { CATEGORY_LABEL } from '../lib/options'
import { CATEGORY_TINT } from '../lib/ui'
import { LockIcon, LockOpenIcon, RefreshIcon } from './icons'
import { useAppStore } from '../store/useAppStore'
import FavoriteButton from './favorites/FavoriteButton'

interface MealSlotCardProps {
  category: Category
  recipe: Recipe | null
  locked: boolean
  onToggleLock: () => void
  onRedraw: () => void
  index?: number
}

export default function MealSlotCard({
  category,
  recipe,
  locked,
  onToggleLock,
  onRedraw,
  index = 0,
}: MealSlotCardProps) {
  const navigate = useNavigate()
  const favorites = useAppStore((s) => s.favorites)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const favorited = recipe ? favorites.includes(recipe.id) : false

  return (
    <div
      className="flip-in flex flex-col overflow-hidden rounded-card border border-white/10 bg-panel"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between border-b border-white/5 px-3.5 py-2">
        <span className="text-xs font-medium text-dim">{CATEGORY_LABEL[category]}</span>
        <div className="flex items-center gap-2">
          {recipe && (
            <FavoriteButton
              active={favorited}
              onToggle={() => toggleFavorite(recipe.id)}
              size={16}
            />
          )}
          <button
            type="button"
            onClick={onToggleLock}
            title={locked ? '已锁定，点击解锁' : '锁定本餐'}
            className={`transition-colors ${locked ? 'text-accent' : 'text-dim hover:text-ink'}`}
          >
            {locked ? <LockIcon size={16} /> : <LockOpenIcon size={16} />}
          </button>
        </div>
      </div>

      {recipe ? (
        <>
          <button
            type="button"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            className="flex h-24 items-center justify-center transition-opacity hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${CATEGORY_TINT[category]}26, transparent)` }}
          >
            <span className="text-5xl drop-shadow-sm">{recipe.emoji}</span>
          </button>
          <div className="flex flex-1 flex-col p-3.5">
            <div className="mb-1 line-clamp-1 text-sm font-semibold text-ink">{recipe.name}</div>
            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-lg font-bold tabular-nums text-accent">{recipe.calories}</span>
              <span className="text-xs text-dim">kcal</span>
            </div>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs tabular-nums text-dim">
                P {recipe.protein} · C {recipe.carbs} · F {recipe.fat}
              </span>
              <button
                type="button"
                onClick={onRedraw}
                className="inline-flex items-center gap-1 text-xs text-accent transition-colors hover:text-accent-strong"
              >
                <RefreshIcon size={14} />
                重抽
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-40 items-center justify-center text-sm text-dim">尚未抽取</div>
      )}
    </div>
  )
}
