import type {
  Category,
  Constraints,
  MealSlot,
  NoSolution,
  Recipe,
  Totals,
} from '../types'
import { isProteinSource, sumTotals } from './nutrition'
import { CATEGORIES, CATEGORY_LABEL } from './options'

export type DrawOutcome =
  | { ok: true; slots: MealSlot[]; totals: Totals }
  | { ok: false; error: NoSolution }

function norm(s: string): string {
  return s.trim().replace(/\s+/g, '').toLowerCase()
}

/** 按约束过滤某个餐别的候选菜谱 */
function filterCandidates(
  recipes: Recipe[],
  category: Category,
  c: Constraints,
): Recipe[] {
  const [min, max] = c.mealCalorieRanges[category]
  return recipes.filter((r) => {
    if (r.category !== category) return false
    if (r.calories < min || r.calories > max) return false
    if (r.allergens.some((a) => c.avoidAllergens.includes(a))) return false
    if (c.avoidIngredients.some((av) => r.ingredients.some((ing) => ing.name.includes(av))))
      return false
    if (c.vegetarian && !r.tags.includes('素食')) return false
    return true
  })
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** 校验一次完整组合是否满足全局约束（chosen 按 CATEGORIES 顺序对齐） */
function comboValid(chosen: Recipe[], c: Constraints): boolean {
  const tot = sumTotals(chosen)
  if (tot.calories > c.totalCaloriesMax) return false
  if (tot.calories < c.totalCaloriesMin) return false
  if (tot.protein < c.proteinMin) return false

  if (c.avoidDuplicateMainIngredient) {
    const mains = chosen.map((r) => norm(r.mainIngredient))
    if (new Set(mains).size !== mains.length) return false
  }

  if (c.requireProteinSource) {
    // 早/午/晚三餐中至少一份优质蛋白
    if (!chosen.slice(0, 3).some(isProteinSource)) return false
  }

  return true
}

/**
 * 受约束的随机抽取：过滤候选集 → 随机采样直至命中。
 * locked 传入某餐锁定的菜谱 id，锁定餐不参与重抽。
 */
export function drawMeals(
  recipes: Recipe[],
  constraints: Constraints,
  locked: Partial<Record<Category, string>> = {},
): DrawOutcome {
  const c = constraints
  const candidates: Record<Category, Recipe[]> = {
    breakfast: filterCandidates(recipes, 'breakfast', c),
    lunch: filterCandidates(recipes, 'lunch', c),
    dinner: filterCandidates(recipes, 'dinner', c),
    snack: filterCandidates(recipes, 'snack', c),
  }

  const empty = CATEGORIES.filter((cat) => candidates[cat].length === 0)
  if (empty.length > 0) {
    return { ok: false, error: emptyError(empty, c) }
  }

  // 解析锁定菜谱（若因约束变化已不可行则丢弃该锁）
  const pinned: Partial<Record<Category, Recipe>> = {}
  for (const cat of CATEGORIES) {
    const id = locked[cat]
    if (id) {
      const r = candidates[cat].find((x) => x.id === id)
      if (r) pinned[cat] = r
    }
  }

  const MAX_ATTEMPTS = 4000
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const chosen = CATEGORIES.map((cat) => pinned[cat] ?? pick(candidates[cat]))
    if (comboValid(chosen, c)) {
      const slots: MealSlot[] = CATEGORIES.map((cat, idx) => ({
        category: cat,
        recipe: chosen[idx],
        locked: Boolean(pinned[cat]),
      }))
      return { ok: true, slots, totals: sumTotals(chosen) }
    }
  }

  return { ok: false, error: noSolutionError(candidates, c, pinned) }
}

function emptyError(empty: Category[], c: Constraints): NoSolution {
  const filters = [
    c.vegetarian ? '素食' : '',
    c.avoidAllergens.length || c.avoidIngredients.length ? '忌口过滤' : '',
  ]
    .filter(Boolean)
    .join('、')

  return {
    message: '部分餐别没有可选菜谱',
    suggestions: empty.map((cat) => {
      const [min, max] = c.mealCalorieRanges[cat]
      return `「${CATEGORY_LABEL[cat]}」在当前约束下（${min}–${max} kcal${filters ? `、${filters}` : ''}）无可用菜谱，建议放宽该餐热量区间或减少忌口项`
    }),
  }
}

function noSolutionError(
  candidates: Record<Category, Recipe[]>,
  c: Constraints,
  pinned: Partial<Record<Category, Recipe>>,
): NoSolution {
  const suggestions: string[] = []

  const calMin = CATEGORIES.map(
    (cat) => pinned[cat]?.calories ?? Math.min(...candidates[cat].map((r) => r.calories)),
  )
  const calMax = CATEGORIES.map(
    (cat) => pinned[cat]?.calories ?? Math.max(...candidates[cat].map((r) => r.calories)),
  )
  const proMax = CATEGORIES.map(
    (cat) => pinned[cat]?.protein ?? Math.max(...candidates[cat].map((r) => r.protein)),
  )
  const minTotal = calMin.reduce((a, b) => a + b, 0)
  const maxTotal = calMax.reduce((a, b) => a + b, 0)
  const maxProtein = proMax.reduce((a, b) => a + b, 0)

  if (minTotal > c.totalCaloriesMax) {
    suggestions.push(
      `总热量上限过低：当前约束下四餐最低约 ${minTotal} kcal，建议将上限提高至 ≥ ${minTotal} kcal`,
    )
  }
  if (maxTotal < c.totalCaloriesMin) {
    suggestions.push(
      `总热量下限过高：当前约束下四餐最高约 ${maxTotal} kcal，建议将下限降低至 ≤ ${maxTotal} kcal`,
    )
  }
  if (maxProtein < c.proteinMin) {
    suggestions.push(
      `蛋白质下限过高：当前约束下四餐最高约 ${maxProtein} g，建议将下限降低至 ≤ ${maxProtein} g`,
    )
  }
  if (c.requireProteinSource) {
    const mainCats: Category[] = ['breakfast', 'lunch', 'dinner']
    const hasProtein = mainCats.some((cat) =>
      (pinned[cat] ? [pinned[cat]!] : candidates[cat]).some(isProteinSource),
    )
    if (!hasProtein) {
      suggestions.push('候选菜谱中缺少「优质蛋白来源」，建议关闭「荤素搭配」或放宽素食/忌口限制')
    }
  }
  if (c.avoidDuplicateMainIngredient) {
    const mains = new Set<string>()
    for (const cat of CATEGORIES) {
      if (pinned[cat]) mains.add(norm(pinned[cat]!.mainIngredient))
      else candidates[cat].forEach((r) => mains.add(norm(r.mainIngredient)))
    }
    if (mains.size < 4) {
      suggestions.push('候选菜谱的主食材种类不足 4 种，无法满足「食材去重」，建议关闭该选项')
    }
  }

  if (suggestions.length === 0) {
    suggestions.push('约束组合过于严格，随机采样未命中，建议适当放宽总热量上限或蛋白质下限')
  }

  return { message: '未找到满足所有约束的搭配', suggestions }
}
