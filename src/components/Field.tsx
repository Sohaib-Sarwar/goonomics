import type { ReactNode } from 'react'

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  help?: string
  error?: string
  suffix?: string
  placeholder?: string
  inputMode?: 'numeric' | 'decimal' | 'text'
  maxLength?: number
  compact?: boolean
  children?: ReactNode
}

/**
 * Text inputs with numeric keyboards (not type="number"), so partial values like "0." and comma
 * decimals survive typing. Validation happens on submit.
 */
export function Field({
  id,
  label,
  value,
  onChange,
  help,
  error,
  suffix,
  placeholder,
  inputMode = 'decimal',
  maxLength = 8,
  compact = false,
  children,
}: FieldProps) {
  const helpId = help ? `${id}-help` : undefined
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={`block font-medium text-paper ${compact ? 'text-sm' : ''}`}>
        {label}
      </label>
      {help && !compact && (
        <p id={helpId} className="mt-1 text-sm leading-snug text-muted">
          {help}
        </p>
      )}
      <div
        className={`mt-2 flex items-stretch border bg-ink transition-colors focus-within:border-lime ${
          error ? 'border-coral' : 'border-line-strong hover:border-faint'
        }`}
      >
        <input
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode={inputMode}
          autoComplete="off"
          spellCheck={false}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
          className={`tabular w-full min-w-0 bg-transparent px-3 font-mono text-paper placeholder:text-faint focus:outline-none ${
            compact ? 'py-2 text-sm' : 'py-3 text-lg'
          }`}
        />
        {suffix && <span className="flex items-center border-l border-line px-3 font-mono text-xs whitespace-nowrap text-muted">{suffix}</span>}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-coral">
          {error}
        </p>
      )}
      {children}
    </div>
  )
}
