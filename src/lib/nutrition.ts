import type { Ingredient, Recipe, Totals } from '../types'
import { FOOD_DB } from '../data/foodComposition'

export const EMPTY_TOTALS: Totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }

/** 常用「个/片/瓣」食材的每单位克数（近似值） */
const GRAMS_PER_UNIT: Record<string, number> = {
  鸡蛋: 50,
  咸鸭蛋: 60,
  香蕉: 100,
  苹果: 180,
  牛油果: 140,
  玉米: 150,
  红薯: 150,
  土豆: 150,
  番茄: 150,
  蒜: 5,
  姜: 5,
  火腿: 20,
  海苔: 2,
  蛋白棒: 40,
  黑巧克力: 10,
  奶酪: 20,
  全麦吐司: 30,
  全麦面包: 30,
  卷饼: 50,
  杂粮馒头: 80,
}

/** 把食材用量统一换算成克（液体近似 1 毫升 ≈ 1 克） */
export function toGrams(ing: Ingredient): number {
  switch (ing.unit) {
    case '克':
    case '毫升':
      return ing.amount
    case '茶匙':
      return ing.amount * 5
    case '汤匙':
      return ing.amount * 15
    case '个':
    case '片':
    case '瓣':
      return ing.amount * (GRAMS_PER_UNIT[ing.name] ?? 10)
  }
}

/** 由食材克数 × 每 100 克成分表计算营养（科学计算值） */
export function computeNutrition(ingredients: Ingredient[]): Totals {
  const totals: Totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }
  for (const ing of ingredients) {
    const entry = FOOD_DB[ing.name]
    if (!entry) {
      console.warn(`[nutrition] 缺少「${ing.name}」的成分数据，已跳过`)
      continue
    }
    const factor = toGrams(ing) / 100
    totals.calories += entry.calories * factor
    totals.protein += entry.protein * factor
    totals.carbs += entry.carbs * factor
    totals.fat += entry.fat * factor
  }
  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    fat: Math.round(totals.fat * 10) / 10,
  }
}

export function sumTotals(recipes: readonly (Recipe | null)[]): Totals {
  const totals: Totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }
  for (const r of recipes) {
    if (!r) continue
    totals.calories += r.calories
    totals.protein += r.protein
    totals.carbs += r.carbs
    totals.fat += r.fat
  }
  return totals
}

/** 是否为优质蛋白质来源（用于「荤素搭配」约束） */
export function isProteinSource(r: Recipe): boolean {
  return r.protein >= 20 || r.tags.includes('高蛋白')
}
