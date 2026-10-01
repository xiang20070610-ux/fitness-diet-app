import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { CATEGORIES, CATEGORY_LABEL } from '../lib/options'
import type { Category, Recipe } from '../types'
import {
  RECOMMEND_TARGET,
  drawCustomMenu,
  favoritesOf,
  recommendFor,
} from '../lib/favorites'
import type { CustomMenuEntry } from '../lib/favorites'
import RecipeCard from '../components/RecipeCard'
import Tag from '../components/Tag'
import { BackIcon, DiceIcon, RefreshIcon } from '../components/icons'

export default function Favorites() {
  const navigate = useNavigate()
  const recipes = useAppStore((s) => s.recipes)
  const favorites = useAppStore((s) => s.favorites)
  const recommendEnabled = useAppStore((s) => s.favoriteRecommendEnabled)

  const favSet = useMemo(() => new Set(favorites), [favorites])
  const favByCat = useMemo(() => {
    const map = { breakfast: [], lunch: [], dinner: [], snack: [] } as Record<Category, Recipe[]>
    for (const cat of CATEGORIES) map[cat] = favoritesOf(recipes, favSet, cat)
    return map
  }, [recipes, favSet])

  const [activeTab, setActiveTab] = useState<Category>('breakfast')
  const [selected, setSelected] = useState<Category[]>([...CATEGORIES])
  const [menu, setMenu] = useState<CustomMenuEntry[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])

  const toggleSelected = (cat: Category) =>
    setSelected((s) => (s.includes(cat) ? s.filter((x) => x !== cat) : [...s, cat]))

  const generate = () => {
    if (selected.length === 0) {
      setMenu([])
      setWarnings([])
      setErrors(['请至少勾选一个餐别'])
      return
    }
    const outcome = drawCustomMenu(recipes, favSet, selected, recommendEnabled)
    setMenu(outcome.entries)
    setErrors(outcome.errors)
    setWarnings(outcome.warnings)
  }

  const activeFavs = favByCat[activeTab]
  const activeRecs = recommendEnabled ? recommendFor(recipes, favSet, activeTab) : []
  const showRec = activeFavs.length < RECOMMEND_TARGET && activeRecs.length > 0

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 py-4">
        <button
          type="button"
          onClick={() => navigate('/mine')}
          className="inline-flex items-center gap-1 rounded-full bg-panel px-3 py-1.5 text-sm text-dim shadow-sm transition-colors hover:text-ink"
        >
          <BackIcon size={18} />
          返回
        </button>
        <h1 className="text-base font-bold text-ink">收藏夹</h1>
        <span className="w-16" />
      </div>

      <div className="mx-auto max-w-md space-y-6 px-5 pb-16">
        {/* 抽取定制菜单 */}
        <section className="rounded-card border border-white/10 bg-panel p-5">
          <h2 className="text-sm font-semibold text-ink">抽取定制菜单</h2>
          <p className="mt-1 text-xs text-dim">勾选餐别，仅从你的收藏中随机抽取</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Tag
                key={cat}
                label={CATEGORY_LABEL[cat]}
                active={selected.includes(cat)}
                onClick={() => toggleSelected(cat)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={generate}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-card bg-accent py-3 text-sm font-bold text-emerald-950 transition-transform active:scale-[0.98]"
          >
            <DiceIcon size={18} />
            生成菜单
          </button>

          {errors.length > 0 && (
            <div className="mt-3 space-y-1 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              {errors.map((e, i) => (
                <p key={i} className="text-xs text-amber-400">
                  ⚠️ {e}
                </p>
              ))}
            </div>
          )}

          {warnings.length > 0 && (
            <div className="mt-3 space-y-1 rounded-lg border border-white/5 bg-panel2/40 p-3">
              {warnings.map((w, i) => (
                <p key={i} className="text-xs text-dim">
                  💡 {w}
                </p>
              ))}
            </div>
          )}

          {menu.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 text-xs font-semibold text-dim">本次菜单</div>
              <div className="space-y-2">
                {menu.map((entry) => (
                  <button
                    key={entry.category}
                    type="button"
                    onClick={() => navigate(`/recipe/${entry.recipe.id}`)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/5 bg-panel2/40 px-3 py-2.5 text-left transition-colors hover:border-accent/40"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 text-xs text-dim">
                        {CATEGORY_LABEL[entry.category]}
                      </span>
                      <span className="truncate text-sm font-medium text-ink">
                        {entry.recipe.name}
                      </span>
                      {entry.recommended && (
                        <span className="shrink-0 rounded-full bg-accent/90 px-2 py-0.5 text-[11px] font-semibold text-emerald-950">
                          系统推荐
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-dim">
                      {entry.recipe.calories} kcal
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={generate}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-card border border-white/10 py-2.5 text-sm text-dim transition-colors hover:text-ink"
              >
                <RefreshIcon size={14} />
                重新抽取
              </button>
            </div>
          )}
        </section>

        {/* 分类标签页 */}
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {CATEGORIES.map((cat) => {
            const active = activeTab === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-accent text-emerald-950'
                    : 'border border-white/10 bg-panel text-dim hover:text-ink'
                }`}
              >
                {CATEGORY_LABEL[cat]}（{favByCat[cat].length}）
              </button>
            )
          })}
        </div>

        {/* 收藏列表 + 推荐 */}
        <section className="space-y-3">
          {activeFavs.length === 0 ? (
            <div className="rounded-card border border-dashed border-white/10 p-8 text-center">
              <p className="text-sm text-dim">该分类还没有收藏</p>
              <p className="mt-1 text-xs text-dim">在菜谱卡片右上角点 ⭐ 即可收藏</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {activeFavs.map((r, i) => (
                <RecipeCard key={r.id} recipe={r} index={i} />
              ))}
            </div>
          )}

          {showRec && (
            <>
              <p className="text-xs text-dim">
                {activeFavs.length === 0
                  ? '该分类暂无收藏，已为你推荐以下菜品'
                  : '当前收藏较少，已为你推荐部分菜品'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {activeRecs.map((r, i) => (
                  <RecipeCard key={r.id} recipe={r} index={i} badge="系统推荐" />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
