import type { Category } from '../types'

/** 各餐别的点缀色（用于菜谱卡片的氛围渐变，克制使用） */
export const CATEGORY_TINT: Record<Category, string> = {
  breakfast: '#f59e0b',
  lunch: '#10b981',
  dinner: '#38bdf8',
  snack: '#e879f9',
}
