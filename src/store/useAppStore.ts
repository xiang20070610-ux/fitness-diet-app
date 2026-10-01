import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Category,
  Constraints,
  NoSolution,
  Recipe,
  SlotMap,
  Totals,
} from '../types'
import { RECIPES } from '../data/recipes'
import { drawMeals } from '../lib/draw'
import { EMPTY_TOTALS } from '../lib/nutrition'
import { CATEGORIES } from '../lib/options'

export const DEFAULT_CONSTRAINTS: Constraints = {
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

const EMPTY_SLOTS: SlotMap = { breakfast: null, lunch: null, dinner: null, snack: null }

interface AppState {
  recipes: Recipe[]
  constraints: Constraints
  slots: SlotMap
  locked: Partial<Record<Category, boolean>>
  totals: Totals
  drawError: NoSolution | null
  hasDrawn: boolean
  recommendation: SlotMap
  recommendationTotals: Totals
  hasRecommendation: boolean
  recommendationError: NoSolution | null
  favorites: string[]
  favoriteRecommendEnabled: boolean
  drawAll: () => void
  drawRecommendation: () => void
  redrawUnlocked: () => void
  redrawOne: (category: Category) => void
  toggleLock: (category: Category) => void
  setConstraints: (partial: Partial<Constraints>) => void
  resetConstraints: () => void
  toggleFavorite: (id: string) => void
  setFavoriteRecommendEnabled: (v: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const applyDraw = (pinned: Partial<Record<Category, string>>) => {
        const res = drawMeals(get().recipes, get().constraints, pinned)
        if (res.ok) {
          const slots: SlotMap = { ...EMPTY_SLOTS }
          for (const s of res.slots) slots[s.category] = s.recipe
          set({ slots, totals: res.totals, drawError: null, hasDrawn: true })
        } else {
          set({ drawError: res.error })
        }
      }

      return {
        recipes: RECIPES,
        constraints: DEFAULT_CONSTRAINTS,
        slots: EMPTY_SLOTS,
        locked: {},
        totals: EMPTY_TOTALS,
        drawError: null,
        hasDrawn: false,
        recommendation: EMPTY_SLOTS,
        recommendationTotals: EMPTY_TOTALS,
        hasRecommendation: false,
        recommendationError: null,
        favorites: [],
        favoriteRecommendEnabled: true,

        drawAll: () => {
          applyDraw({})
          set({ locked: {} })
        },

        drawRecommendation: () => {
          const res = drawMeals(get().recipes, get().constraints, {})
          if (res.ok) {
            const slots: SlotMap = { ...EMPTY_SLOTS }
            for (const s of res.slots) slots[s.category] = s.recipe
            set({ recommendation: slots, recommendationTotals: res.totals, hasRecommendation: true, recommendationError: null })
          } else {
            set({ recommendationError: res.error })
          }
        },

        redrawUnlocked: () => {
          const pinned: Partial<Record<Category, string>> = {}
          for (const cat of CATEGORIES) {
            if (get().locked[cat] && get().slots[cat]) pinned[cat] = get().slots[cat]!.id
          }
          applyDraw(pinned)
        },

        redrawOne: (category) => {
          const pinned: Partial<Record<Category, string>> = {}
          for (const cat of CATEGORIES) {
            if (cat !== category && get().slots[cat]) pinned[cat] = get().slots[cat]!.id
          }
          applyDraw(pinned)
          set((s) => {
            const locked = { ...s.locked }
            delete locked[category]
            return { locked }
          })
        },

        toggleLock: (category) => {
          set((s) => ({ locked: { ...s.locked, [category]: !s.locked[category] } }))
        },

        setConstraints: (partial) => {
          set((s) => ({ constraints: { ...s.constraints, ...partial } }))
        },

        resetConstraints: () => set({ constraints: DEFAULT_CONSTRAINTS }),

        toggleFavorite: (id) =>
          set((s) => ({
            favorites: s.favorites.includes(id)
              ? s.favorites.filter((x) => x !== id)
              : [...s.favorites, id],
          })),

        setFavoriteRecommendEnabled: (v) => set({ favoriteRecommendEnabled: v }),
      }
    },
    {
      name: 'fitness-diet-app',
      partialize: (s) => ({
        constraints: s.constraints,
        favorites: s.favorites,
        favoriteRecommendEnabled: s.favoriteRecommendEnabled,
      }),
      merge: (persistedState, currentState) => {
        const p = (persistedState ?? {}) as Partial<AppState>
        return {
          ...currentState,
          ...p,
          constraints: { ...DEFAULT_CONSTRAINTS, ...(p.constraints ?? {}) },
          favorites: p.favorites ?? [],
          favoriteRecommendEnabled: p.favoriteRecommendEnabled ?? true,
        }
      },
    },
  ),
)
