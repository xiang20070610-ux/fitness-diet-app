interface StepperProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (v: number) => void
}

const btnCls =
  'flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-dim transition-colors hover:border-accent/40 hover:text-accent'

export default function Stepper({
  label,
  value,
  min,
  max,
  step = 10,
  suffix,
  onChange,
}: StepperProps) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs text-dim">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={btnCls}
          onClick={() => onChange(Math.max(min, value - step))}
        >
          −
        </button>
        <span className="w-14 text-center text-sm font-semibold tabular-nums text-ink">
          {value}
          {suffix && <span className="text-xs font-normal text-dim">{suffix}</span>}
        </span>
        <button
          type="button"
          className={btnCls}
          onClick={() => onChange(Math.min(max, value + step))}
        >
          +
        </button>
      </div>
    </div>
  )
}
