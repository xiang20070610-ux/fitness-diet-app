import { StarIcon } from '../icons'

interface FavoriteButtonProps {
  active: boolean
  onToggle: () => void
  size?: number
  className?: string
}

export default function FavoriteButton({
  active,
  onToggle,
  size = 18,
  className = '',
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      title={active ? '取消收藏' : '收藏'}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-150 hover:scale-110 ${
        active ? 'text-amber-400' : 'text-dim'
      } ${className}`}
    >
      <StarIcon size={size} fill={active ? 'currentColor' : 'none'} />
    </button>
  )
}
