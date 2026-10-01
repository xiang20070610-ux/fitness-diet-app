import { useEffect, useState } from 'react'
import { resolveImage } from '../lib/images'

type Ratio = '4/5' | 'square'

interface DishImageProps {
  /** 图片 URL，为空则渲染 emoji 占位 */
  src?: string | null
  emoji?: string
  alt?: string
  /** 主图竖构图 4:5，步骤小图 1:1 */
  ratio?: Ratio
  rounded?: string
  className?: string
  emojiClassName?: string
}

const RATIO_CLASS: Record<Ratio, string> = {
  '4/5': 'aspect-[4/5]',
  square: 'aspect-square',
}

/**
 * 统一图片组件：有真实图片则渲染 <img>（object-cover），
 * 为空或加载失败则回退到 emoji 占位。占位与真图共用同一比例、圆角与裁切。
 */
export default function DishImage({
  src,
  emoji = '🍽️',
  alt = '',
  ratio = '4/5',
  rounded = 'rounded-2xl',
  className = '',
  emojiClassName = 'text-7xl',
}: DishImageProps) {
  const resolved = resolveImage(src)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [resolved])

  const showImage = Boolean(resolved) && !failed

  return (
    <div
      className={`dish-placeholder relative overflow-hidden ${RATIO_CLASS[ratio]} ${rounded} ${className}`}
    >
      {showImage ? (
        <img
          src={resolved}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`drop-shadow-sm ${emojiClassName}`}>{emoji}</span>
        </div>
      )}
    </div>
  )
}
