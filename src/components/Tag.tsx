interface TagProps {
  label: string
  active?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export default function Tag({ label, active, onClick, size = 'md' }: TagProps) {
  const sizeCls = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  const stateCls = active
    ? 'border-accent/50 bg-accent/15 text-accent'
    : 'border-white/10 bg-panel2/60 text-dim hover:text-ink'

  if (!onClick) {
    return (
      <span className={`inline-flex items-center rounded-full border ${sizeCls} ${stateCls}`}>
        {label}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border font-medium transition-colors duration-150 ${sizeCls} ${stateCls}`}
    >
      {label}
    </button>
  )
}
