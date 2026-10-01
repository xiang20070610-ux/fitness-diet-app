interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (v: number) => void
}

export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: SliderProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-ink">{label}</span>
        <span className="text-base font-bold tabular-nums text-ink">
          {value}
          {suffix && <span className="ml-1 text-xs font-normal text-dim">{suffix}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider w-full"
      />
    </div>
  )
}
