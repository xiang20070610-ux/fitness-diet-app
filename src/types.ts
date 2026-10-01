export type Category = 'breakfast' | 'lunch' | 'dinner' | 'snack'

// 计量单位（全中文，不出现英文单位）
export type Unit = '克' | '毫升' | '茶匙' | '汤匙' | '个' | '片' | '瓣'

// 食材类型
export type IngredientType = '主食材' | '调料' | '可选替换'

export interface Ingredient {
  name: string // 名称
  amount: number // 数值
  unit: Unit // 单位
  prep?: string // 预处理（「切丝」「提前腌制」）
  type: IngredientType
  note?: string // 备注（「可用鸡腿肉替代」）
}

export interface Step {
  order: number // 序号 1~6
  action: string // 动作描述
  duration?: number // 时长（分钟，参考值）
  heat?: string // 火候（大火/中火/小火/160–180℃）
  doneWhen?: string // 判断标准（「炒至变色」）
  tip?: string // 新手提示 / 失败点
  image?: string // 步骤图占位
}

export interface PrepStep {
  action: string
  duration?: number
}

// 数据来源与审核状态
export type SourceType = 'cnfct' | 'usda' | 'standard-recipe' | 'reference' | 'ai'
export type ReviewStatus = 'verified' | 'pending'
export interface DataSource {
  source: SourceType
  reviewStatus: ReviewStatus
  label?: string // 展示文案
}

export interface Recipe {
  id: string
  name: string
  category: Category
  calories: number // kcal（由成分表计算，非手填）
  protein: number // g
  carbs: number // g
  fat: number // g
  ingredients: Ingredient[] // 结构化食材（含克数/单位）
  tools?: string[] // 工具清单
  prep?: PrepStep[] // 预处理（腌制/焯水）
  steps: Step[] // 结构化步骤
  mainIngredient: string // 主食材（用于食材去重）
  allergens: string[] // egg / milk / gluten / peanut / soy / fish / shellfish / tree-nut
  tags: string[] // 素食 / 高蛋白 / 低碳 / 低脂 / 无麸质 等
  cookTime: number // 烹饪时长（步骤 duration 求和，自动）
  prepTime?: number // 准备时长（prep duration 求和，自动）
  difficulty: 1 | 2 | 3 // 简单 / 中等 / 较难
  emoji: string
  image?: string // 主图 URL（空则用 emoji 占位）
  stepImages?: string[] // 步骤小图 URL 列表（缺省用 emoji 占位）
  description?: string // 一句话描述（缺省时自动生成）
  tips?: string[] // 翻车提示 / 小贴士
  source: DataSource // 数据来源与审核状态
}

export type MealCalorieRanges = Record<Category, [number, number]>

export interface Constraints {
  totalCaloriesMax: number
  totalCaloriesMin: number
  mealCalorieRanges: MealCalorieRanges
  proteinMin: number
  vegetarian: boolean
  avoidAllergens: string[]
  avoidIngredients: string[]
  avoidDuplicateMainIngredient: boolean
  requireProteinSource: boolean
}

export interface MealSlot {
  category: Category
  recipe: Recipe | null
  locked: boolean
}

export interface Totals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface NoSolution {
  message: string
  suggestions: string[]
}

export type SlotMap = Record<Category, Recipe | null>
