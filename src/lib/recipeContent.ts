import type { Category, Ingredient, Recipe } from '../types'

type DescFn = (name: string) => string

const DESCRIPTIONS: Record<Category, DescFn[]> = {
  breakfast: [
    (n) => `${n}，暖胃又扛饿，开启元气满满的一天。`,
    (n) => `一份${n}，快手又满足，早餐不将就。`,
  ],
  lunch: [
    (n) => `${n}，荤素均衡、饱腹感拉满的工作日午餐。`,
    (n) => `午餐来一份${n}，营养在线，下午不犯困。`,
  ],
  dinner: [
    (n) => `${n}，清淡不腻，晚餐刚刚好。`,
    (n) => `晚餐选${n}，低负担，吃得舒服睡得香。`,
  ],
  snack: [
    (n) => `${n}，解馋又垫肚的小食，随时来一口。`,
    (n) => `嘴馋时来一份${n}，补充能量不罪恶。`,
  ],
}

export function recipeDescription(r: Recipe): string {
  if (r.description) return r.description
  const pool = DESCRIPTIONS[r.category]
  return pool[r.name.length % pool.length](r.name)
}

/** 按 type 把食材分成「食材」和「调料」两组（可选替换归入食材组，由 UI 加标签） */
export function splitIngredients(r: Recipe): {
  foods: Ingredient[]
  seasonings: Ingredient[]
} {
  const foods: Ingredient[] = []
  const seasonings: Ingredient[] = []
  for (const ing of r.ingredients) {
    if (ing.type === '调料') seasonings.push(ing)
    else foods.push(ing)
  }
  return { foods, seasonings }
}

/** 食材用量格式化：克/个等直接展示，毫升附汤匙/茶匙换算 */
export function formatAmount(ing: Ingredient): string {
  const { amount, unit } = ing
  switch (unit) {
    case '毫升':
      if (amount > 0 && amount % 15 === 0) return `${amount} 毫升（${amount / 15} 汤匙）`
      if (amount > 0 && amount % 5 === 0) return `${amount} 毫升（${amount / 5} 茶匙）`
      return `${amount} 毫升`
    default:
      return `${amount} ${unit}`
  }
}

export function recipeTips(r: Recipe): string[] {
  return r.tips ?? []
}

const STEP_EMOJI: [RegExp, string][] = [
  [/备料|准备|清洗|切|处理/, '🔪'],
  [/热锅|油|下锅|炒|煮|炖|蒸|煎|烧|焖|收汁/, '🍳'],
  [/调味|盐|酱油|调料/, '🧂'],
  [/装盘|出锅|摆盘/, '🍽️'],
]
const STEP_FALLBACK = ['🥬', '🍳', '🧂', '🍽️', '✨']

export function stepEmoji(action: string, index: number): string {
  for (const [re, emoji] of STEP_EMOJI) {
    if (re.test(action)) return emoji
  }
  return STEP_FALLBACK[index % STEP_FALLBACK.length]
}
