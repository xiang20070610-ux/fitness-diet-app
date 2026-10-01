import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { ArrowRightIcon, StarIcon } from '../components/icons'

export default function Mine() {
  const navigate = useNavigate()
  const favorites = useAppStore((s) => s.favorites)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">我的</h1>
        <p className="mt-1 text-sm text-dim">管理收藏，定制你的专属菜单</p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/favorites')}
        className="flex w-full items-center gap-4 rounded-card border border-white/10 bg-panel p-5 text-left transition-colors hover:border-accent/40"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400">
          <StarIcon size={22} fill="currentColor" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-semibold text-ink">收藏夹</span>
          <span className="mt-0.5 block text-xs text-dim">
            已收藏 {favorites.length} 道菜谱 · 分类查看与抽取菜单
          </span>
        </span>
        <ArrowRightIcon size={18} className="shrink-0 text-dim" />
      </button>
    </div>
  )
}
