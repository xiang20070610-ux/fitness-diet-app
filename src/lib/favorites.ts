import type { Category, Recipe } from '../types'
import { CATEGORY_LABEL } from './options'

/** 一次「抽取菜单」的单项结果 */
export interface CustomMenuEntry {
  category: Category
  recipe: Recipe
  recommended: boolean // 是否为系统推荐（非用户收藏）
}

/** 收藏数量不足时的推荐目标条数 */
export const RECOMMEND_TARGET = 5

/** 某分类下已收藏的菜谱 */
export function favoritesOf(
  recipes: Recipe[],
  favoriteIds: Set<string>,
  category: Category,
): Recipe[] {
  return recipes.filter((r) => r.category === category && favoriteIds.has(r.id))
}

/** 某分类下未收藏的菜谱（系统推荐候选） */
function uncollectedOf(
  recipes: Recipe[],
  favoriteIds: Set<string>,
  category: Category,
): Recipe[] {
  return recipes.filter((r) => r.category === category && !favoriteIds.has(r.id))
}

/** 收藏不足时推荐的菜谱：补足到 RECOMMEND_TARGET 个 */
export function recommendFor(
  recipes: Recipe[],
  favoriteIds: Set<string>,
  category: Category,
): Recipe[] {
  const favs = favoritesOf(recipes, favoriteIds, category)
  if (favs.length >= RECOMMEND_TARGET) return []
  const need = RECOMMEND_TARGET - favs.length
  return uncollectedOf(recipes, favoriteIds, category).slice(0, need)
}

export interface DrawCustomMenuOutcome {
  entries: CustomMenuEntry[]
  errors: string[]
  warnings: string[]
}

/** 从收藏（+不足时的系统推荐）中，按勾选分类各自独立随机抽取一份菜单 */
export function drawCustomMenu(
  recipes: Recipe[],
  favoriteIds: Set<string>,
  categories: Category[],
  recommendEnabled: boolean,
): DrawCustomMenuOutcome {
  const entries: CustomMenuEntry[] = []
  const errors: string[] = []
  const warnings: string[] = []

  for (const cat of categories) {
    const favs = favoritesOf(recipes, favoriteIds, cat)
    const recs =
      recommendEnabled && favs.length < RECOMMEND_TARGET
        ? recommendFor(recipes, favoriteIds, cat)
        : []

    if (favs.length === 0 && recs.length === 0) {
      errors.push(
        recommendEnabled
          ? `「${CATEGORY_LABEL[cat]}」没有收藏食品，也没有可推荐的菜品`
          : `「${CATEGORY_LABEL[cat]}」没有收藏食品，请先收藏或开启推荐`,
      )
      continue
    }

    if (favs.length === 0) {
      warnings.push(`「${CATEGORY_LABEL[cat]}」暂无收藏，已用系统推荐补充`)
    }

    const pool = [...favs, ...recs]
    const recIds = new Set(recs.map((r) => r.id))
    const recipe = pool[Math.floor(Math.random() * pool.length)]
    entries.push({ category: cat, recipe, recommended: recIds.has(recipe.id) })
  }

  return { entries, errors, warnings }
}
