import type { Category } from '../types'

export const CATEGORIES: Category[] = ['breakfast', 'lunch', 'dinner', 'snack']

export const CATEGORY_LABEL: Record<Category, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '点心',
}

export interface Option {
  id: string
  label: string
}

export const ALLERGEN_OPTIONS: Option[] = [
  { id: 'egg', label: '蛋类' },
  { id: 'milk', label: '奶制品' },
  { id: 'gluten', label: '麸质' },
  { id: 'peanut', label: '花生' },
  { id: 'soy', label: '大豆' },
  { id: 'fish', label: '鱼类' },
  { id: 'shellfish', label: '虾贝' },
  { id: 'tree-nut', label: '坚果' },
]

export const AVOID_OPTIONS: Option[] = [
  { id: '牛肉', label: '牛肉' },
  { id: '猪肉', label: '猪肉' },
  { id: '羊肉', label: '羊肉' },
  { id: '鸡肉', label: '鸡肉' },
  { id: '鸭肉', label: '鸭肉' },
  { id: '鱼', label: '鱼' },
  { id: '虾', label: '虾' },
]

export const DIFFICULTY_LABEL: Record<1 | 2 | 3, string> = {
  1: '简单',
  2: '中等',
  3: '较难',
}
