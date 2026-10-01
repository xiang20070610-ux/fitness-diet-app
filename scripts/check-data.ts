import { RECIPES } from '../src/data/recipes'
import { FOOD_DB } from '../src/data/foodComposition'
import { computeNutrition } from '../src/lib/nutrition'
import { drawMeals } from '../src/lib/draw'
import { CATEGORIES } from '../src/lib/options'
import type { Constraints } from '../src/types'

const BANDS: Record<string, [number, number]> = {
  breakfast: [200, 450],
  lunch: [400, 700],
  dinner: [400, 700],
  snack: [80, 250],
}

const CONSTRAINTS: Constraints = {
  totalCaloriesMax: 1600,
  totalCaloriesMin: 1200,
  mealCalorieRanges: {
    breakfast: [200, 450],
    lunch: [400, 700],
    dinner: [400, 700],
    snack: [80, 250],
  },
  proteinMin: 60,
  vegetarian: false,
  avoidAllergens: [],
  avoidIngredients: [],
  avoidDuplicateMainIngredient: false,
  requireProteinSource: true,
}

let problems = 0

// 1. 每个食材都在成分表
const missing = new Set<string>()
for (const r of RECIPES) {
  for (const ing of r.ingredients) {
    if (!FOOD_DB[ing.name]) missing.add(ing.name)
  }
}
if (missing.size) {
  problems += missing.size
  console.log('❌ 成分表缺失食材：', [...missing].join('、'))
} else {
  console.log('✅ 所有食材都在成分表中')
}

// 2. 热量在餐别区间内
console.log('\n—— 各菜热量核对（超出区间会标出）——')
for (const r of RECIPES) {
  const n = computeNutrition(r.ingredients)
  const [min, max] = BANDS[r.category]
  const inBand = n.calories >= min && n.calories <= max
  if (!inBand) {
    problems += 1
    console.log(
      `❌ ${r.category}「${r.name}」计算热量 ${n.calories} kcal（目标 ${min}–${max}），蛋白 ${n.protein}g`,
    )
  }
}

// 3. computeNutrition 与 recipe 字段一致
for (const r of RECIPES) {
  const n = computeNutrition(r.ingredients)
  if (
    n.calories !== r.calories ||
    n.protein !== r.protein ||
    n.carbs !== r.carbs ||
    n.fat !== r.fat
  ) {
    problems += 1
    console.log(`❌ 「${r.name}」营养字段与计算不一致`)
  }
}

// 4. 默认约束下能否抽出可行组合（跑 50 次抽样）
let draws = 0
let okDraws = 0
for (let i = 0; i < 50; i++) {
  draws += 1
  const res = drawMeals(RECIPES, CONSTRAINTS, {})
  if (res.ok) {
    okDraws += 1
  } else if (i === 0) {
    console.log('❌ 默认约束下抽取失败：', JSON.stringify(res.error, null, 2))
  }
}
if (okDraws === draws) {
  console.log(`\n✅ 默认约束下 50/50 次成功抽出一日四餐`)
} else {
  problems += 1
  console.log(`\n❌ 默认约束下仅 ${okDraws}/${draws} 次成功`)
}

// 5. 每餐候选集非空（素食、忌口等极端约束之外的基线）
for (const cat of CATEGORIES) {
  const cnt = RECIPES.filter((r) => {
    const [min, max] = BANDS[cat]
    return r.category === cat && r.calories >= min && r.calories <= max
  }).length
  console.log(`   ${cat}: ${cnt} 道在区间内`)
}

console.log(`\n${problems === 0 ? '✅ 全部通过' : `❌ 共 ${problems} 个问题`}`)
process.exit(problems === 0 ? 0 : 1)
