import { Minus, Plus } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { parseNumber } from '../lib/validate'

/** Radio group styled as connected pills. Arrow keys move between options. */
export function Segmented<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
  size = 'md',
}: {
  label: string
  hint?: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  size?: 'sm' | 'md'
}) {
  const id = useId()
  const move = (dir: 1 | -1) => {
    const i = options.findIndex((o) => o.value === value)
    const next = options[(i + dir + options.length) % options.length]!
    onChange(next.value)
    document.getElementById(`${id}-${next.value}`)?.focus()
  }
  return (
    <div>
      <p id={`${id}-label`} className="font-semibold">
        {label}
      </p>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className="mt-2 grid rounded-xl border border-line-strong bg-ink p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') (e.preventDefault(), move(1))
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') (e.preventDefault(), move(-1))
        }}
      >
        {options.map((o) => {
          const active = o.value === value
          return (
            <button
              key={o.value}
              id={`${id}-${o.value}`}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(o.value)}
              className={`press rounded-lg font-semibold ${size === 'sm' ? 'px-2 py-1.5 text-xs' : 'px-2 py-2.5 text-sm'} ${
                active ? 'bg-lime text-ink' : 'text-muted hover:text-paper'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Slider plus a typed number, kept in sync. The typed value may exceed the slider range. */
export function SliderField({
  id,
  label,
  hint,
  value,
  onChange,
  onBlur,
  min,
  max,
  step,
  unit,
  error,
}: {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  min: number
  max: number
  step: number
  unit: string
  error?: string
}) {
  const parsed = parseNumber(value)
  const num = parsed.ok ? parsed.value : min
  const fill = `${(Math.min(max, Math.max(min, num)) - min) / (max - min) * 100}%`
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <label htmlFor={id} className="font-semibold">
            {label}
          </label>
          {hint && (
            <p id={hintId} className="text-sm text-muted">
              {hint}
            </p>
          )}
        </div>
        <div className={`flex shrink-0 items-center rounded-lg border bg-ink ${error ? 'border-coral' : 'border-line-strong focus-within:border-lime'}`}>
          <input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            inputMode="decimal"
            autoComplete="off"
            maxLength={5}
            placeholder="0"
            aria-invalid={error ? true : undefined}
            aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
            className="tabular w-16 bg-transparent px-2.5 py-1.5 text-right font-mono text-lg focus:outline-none"
          />
          <span className="pr-2.5 font-mono text-xs text-muted">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        aria-label={`${label} slider`}
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, num))}
        onChange={(e) => onChange(e.target.value)}
        onPointerUp={onBlur}
        className="slider mt-1"
        style={{ ['--fill' as string]: fill }}
      />
      {error && (
        <p id={errorId} className="text-sm text-coral">
          {error}
        </p>
      )}
    </div>
  )
}

/** Large numeric input with minus and plus buttons, for ages. */
export function BigNumber({
  id,
  label,
  hint,
  value,
  onChange,
  onBlur,
  min,
  max,
  error,
  placeholder,
}: {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  min: number
  max: number
  error?: string
  placeholder?: string
}) {
  const parsed = parseNumber(value)
  const bump = (d: number) => {
    const base = parsed.ok ? Math.round(parsed.value) : d > 0 ? min - 1 : max + 1
    onChange(String(Math.min(max, Math.max(min, base + d))))
  }
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <div>
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
      <div className={`mt-2 flex items-stretch overflow-hidden rounded-xl border-2 bg-ink ${error ? 'border-coral' : 'border-line-strong focus-within:border-lime'}`}>
        <button type="button" onClick={() => bump(-1)} className="press grid w-14 place-items-center text-muted hover:bg-raised hover:text-paper" aria-label={`Decrease ${label}`}>
          <Minus size={20} aria-hidden />
        </button>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          inputMode="numeric"
          autoComplete="off"
          maxLength={3}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className="tabular w-full min-w-0 bg-transparent py-3 text-center font-mono text-4xl font-medium placeholder:text-faint focus:outline-none"
        />
        <button type="button" onClick={() => bump(1)} className="press grid w-14 place-items-center text-muted hover:bg-raised hover:text-paper" aria-label={`Increase ${label}`}>
          <Plus size={20} aria-hidden />
        </button>
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-coral">
          {error}
        </p>
      )}
    </div>
  )
}

export function PrimaryButton({ children, onClick, type = 'button', className = '' }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; className?: string }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`press rounded-xl bg-lime px-6 py-4 font-display text-xl font-extrabold tracking-wide text-ink uppercase shadow-[0_6px_0_#7fae2c] hover:bg-[#d4ff7f] active:translate-y-[3px] active:shadow-[0_3px_0_#7fae2c] ${className}`}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={`press rounded-xl border border-line-strong px-4 py-3 font-semibold text-paper hover:border-paper ${className}`}>
      {children}
    </button>
  )
}
