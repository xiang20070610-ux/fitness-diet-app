import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import RecipeHero from '../components/recipe/RecipeHero'
import DishImage from '../components/DishImage'
import IngredientsPanel from '../components/recipe/IngredientsPanel'
import StepsTimeline from '../components/recipe/StepsTimeline'
import TipsCard from '../components/recipe/TipsCard'
import PrepToolsCard from '../components/recipe/PrepToolsCard'
import FavoriteButton from '../components/favorites/FavoriteButton'
import { BackIcon } from '../components/icons'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const recipe = useAppStore((s) => s.recipes.find((r) => r.id === id))
  const favorited = useAppStore((s) => s.favorites.includes(id ?? ''))
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)

  if (!recipe) {
    return (
      <div className="recipe-page flex min-h-screen items-center justify-center text-sm text-[#8a7d6e]">
        未找到该菜谱
      </div>
    )
  }

  return (
    <div className="recipe-page min-h-screen">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1.5 text-sm text-[#5b4f43] shadow-sm transition-colors hover:bg-white"
        >
          <BackIcon size={18} />
          返回
        </button>
        <FavoriteButton
          active={favorited}
          onToggle={() => toggleFavorite(recipe.id)}
          size={20}
          className="rounded-full bg-white/80 p-2 shadow-sm"
        />
      </div>

      <div className="mx-auto max-w-3xl space-y-8 px-5 pb-16">
        <RecipeHero recipe={recipe} />

        {/* 中部：桌面左食材右主图，移动端主图置顶 */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
          <div className="md:order-2 md:col-span-3">
            <DishImage
              src={recipe.image}
              emoji={recipe.emoji}
              alt={recipe.name}
              ratio="4/5"
              emojiClassName="text-[120px]"
            />
          </div>
          <div className="md:order-1 md:col-span-2">
            <IngredientsPanel recipe={recipe} />
          </div>
        </div>

        <PrepToolsCard recipe={recipe} />
        <StepsTimeline recipe={recipe} />
        <TipsCard recipe={recipe} />
      </div>
    </div>
  )
}
