import { Minus, Plus, X } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { MICROCOPY } from '../lib/copy/lines'
import { OVER_LIMIT, OVER_LIMIT_SHORT, parseNumber } from '../lib/validate'

/** Error text; the 17 a day message gets its short form on narrow screens. */
export function ErrorText({ id, error, className = '' }: { id?: string; error: string; className?: string }) {
  return (
    <p id={id} role="alert" className={`text-sm leading-snug font-semibold text-coral ${className}`}>
      {error === OVER_LIMIT ? (
        <>
          <span className="sm:hidden">{OVER_LIMIT_SHORT}</span>
          <span className="hidden sm:inline">{OVER_LIMIT}</span>
        </>
      ) : (
        error
      )}
    </p>
  )
}

/** Radio group styled as connected pills. Arrow keys move between options. */
export function Segmented<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
  size = 'md',
  hideLabel = false,
}: {
  label: string
  hint?: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  hideLabel?: boolean
}) {
  const id = useId()
  const move = (dir: 1 | -1) => {
    const i = options.findIndex((o) => o.value === value)
    const next = options[(i + dir + options.length) % options.length]!
    onChange(next.value)
    document.getElementById(`${id}-${next.value}`)?.focus()
  }
  return (
    <div className="min-w-0">
      <p id={`${id}-label`} className={hideLabel ? 'sr-only' : 'text-sm font-semibold'}>
        {label}
      </p>
      {hint && !hideLabel && <p className="text-xs text-muted tiny:hidden">{hint}</p>}
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className={`grid rounded-xl border border-line-strong bg-ink p-1 ${hideLabel ? '' : 'mt-1.5'}`}
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
              className={`press min-w-0 rounded-lg px-1.5 leading-tight font-semibold text-balance ${size === 'sm' ? 'py-1.5 text-xs' : 'py-2 text-sm tiny:py-1.5'} ${
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

/** Slider plus a typed number, kept in sync. Typed values beyond the slider range are kept, not clamped. */
export function SliderField({
  id,
  label,
  hint,
  value,
  onChange,
  onFocus,
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
  onFocus?: () => void
  onBlur?: () => void
  min: number
  max: number
  step: number
  unit: string
  error?: string
}) {
  const parsed = parseNumber(value)
  const num = parsed.ok ? parsed.value : min
  const clamped = Math.min(max, Math.max(min, num))
  const fill = `${((clamped - min) / (max - min)) * 100}%`
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <label htmlFor={id} className="block text-sm leading-tight font-semibold">
            {label}
          </label>
          {hint && (
            <p id={hintId} className="truncate text-xs text-muted tiny:hidden">
              {hint}
            </p>
          )}
        </div>
        <div className={`flex shrink-0 items-center rounded-lg border bg-ink ${error ? 'border-coral' : 'border-line-strong focus-within:border-lime'}`}>
          <input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            inputMode="decimal"
            autoComplete="off"
            maxLength={5}
            placeholder="0"
            aria-invalid={error ? true : undefined}
            aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
            className="tabular w-14 bg-transparent px-2 py-1 text-right font-mono text-base focus:outline-none sm:w-16 sm:text-lg"
          />
          <span className="pr-2 font-mono text-[0.7rem] whitespace-nowrap text-muted">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        aria-label={`${label} slider`}
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onPointerUp={onBlur}
        className="slider"
        style={{ ['--fill' as string]: fill }}
      />
      {error && <ErrorText id={errorId} error={error} />}
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
  onFocus,
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
  onFocus?: () => void
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
    onFocus?.()
  }
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block font-semibold">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      <div className={`mt-1.5 flex items-stretch overflow-hidden rounded-xl border-2 bg-ink ${error ? 'border-coral' : 'border-line-strong focus-within:border-lime'}`}>
        <button type="button" onClick={() => bump(-1)} className="press grid w-12 shrink-0 place-items-center text-muted hover:bg-raised hover:text-paper" aria-label={`Decrease ${label}`}>
          <Minus size={18} aria-hidden />
        </button>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          inputMode="numeric"
          autoComplete="off"
          maxLength={3}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className="tabular w-full min-w-0 bg-transparent py-2.5 text-center font-mono text-[clamp(1.6rem,6vh,2.4rem)] font-medium placeholder:text-faint focus:outline-none tiny:py-1.5"
        />
        <button type="button" onClick={() => bump(1)} className="press grid w-12 shrink-0 place-items-center text-muted hover:bg-raised hover:text-paper" aria-label={`Increase ${label}`}>
          <Plus size={18} aria-hidden />
        </button>
      </div>
      {error && <ErrorText id={errorId} error={error} className="mt-1" />}
    </div>
  )
}

export function PrimaryButton({ children, onClick, type = 'button', className = '' }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; className?: string }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`press rounded-xl bg-lime px-5 py-3.5 font-display text-lg leading-none font-extrabold tracking-wide text-ink uppercase shadow-[0_5px_0_#7fae2c] hover:bg-[#d4ff7f] active:translate-y-[3px] active:shadow-[0_2px_0_#7fae2c] sm:text-xl tiny:py-3 ${className}`}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, onClick, className = '', label }: { children: ReactNode; onClick?: () => void; className?: string; label?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className={`press rounded-xl border border-line-strong px-4 py-3 font-semibold text-paper hover:border-paper tiny:py-2.5 ${className}`}>
      {children}
    </button>
  )
}

/**
 * Full height screen with a body that fits the viewport and an action bar pinned at the bottom.
 * The body only scrolls (quietly) if the screen is genuinely too short for its content.
 */
export function StepFrame({ children, actions, className = '' }: { children: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={`flex h-full min-h-0 flex-col ${className}`}>
      <div className="scroll-quiet min-h-0 flex-1">
        <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-4 py-3 sm:px-6">{children}</div>
      </div>
      {actions && (
        <div className="shrink-0 border-t border-line bg-ink/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl gap-2 px-4 py-2.5 sm:px-6 md:justify-end">{actions}</div>
        </div>
      )}
    </div>
  )
}

/** Scales a fixed size artboard (phone mockups, the share card) to fit its box, both ways. */
export function FitBox({ width, height, children, className = '', label }: { width: number; height: number; children: ReactNode; className?: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setScale(Math.max(0.01, Math.min(r.width / width, r.height / height)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width, height])
  return (
    <div ref={ref} className={`relative grid min-h-0 min-w-0 place-items-center ${className}`} aria-label={label} role={label ? 'img' : undefined}>
      <div style={{ width: width * scale, height: height * scale }} className="relative overflow-hidden">
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
      </div>
    </div>
  )
}

/** Dialog that fits the viewport (a bottom sheet on phones). Escape and backdrop close it. */
export function Sheet({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  useEffect(() => {
    if (!open) return
    const returnTo = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      returnTo?.focus()
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-panel sm:rounded-3xl ${wide ? 'max-w-4xl' : 'max-w-2xl'}`}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-3">
          <h2 id={titleId} className="font-display text-2xl leading-none font-black uppercase sm:text-3xl">
            {title}
          </h2>
          <button ref={closeRef} type="button" onClick={onClose} className="press rounded-full p-2 text-muted hover:bg-raised hover:text-paper" aria-label={MICROCOPY.close}>
            <X size={20} aria-hidden />
          </button>
        </div>
        <div className="scroll-quiet min-h-0 flex-1 px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
