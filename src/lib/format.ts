/** Display formatting. Locale is pinned so output is deterministic and testable. */
const LOCALE = 'en-US'

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString(LOCALE)
}

export function fmtNum(n: number, maxFractionDigits = 1): string {
  return n.toLocaleString(LOCALE, { maximumFractionDigits: maxFractionDigits })
}

const SCALE_WORDS: [number, string][] = [
  [1e18, 'quintillion'],
  [1e15, 'quadrillion'],
  [1e12, 'trillion'],
  [1e9, 'billion'],
  [1e6, 'million'],
]

/** 2_310_000_000_000 → "2.31 trillion". Below a million, plain grouped digits. */
export function fmtBigWords(n: number): string {
  if (!Number.isFinite(n)) return '∞'
  const abs = Math.abs(n)
  for (const [scale, word] of SCALE_WORDS) {
    if (abs >= scale) {
      const v = n / scale
      return `${v.toLocaleString(LOCALE, { maximumFractionDigits: v >= 100 ? 0 : v >= 10 ? 1 : 2 })} ${word}`
    }
  }
  return fmtInt(n)
}

/** Scientific notation split for rendering as mantissa × 10^exponent. */
export function toScientific(n: number, digits = 2): { mantissa: string; exponent: number } {
  if (n === 0 || !Number.isFinite(n)) return { mantissa: '0', exponent: 0 }
  const exponent = Math.floor(Math.log10(Math.abs(n)))
  let mantissa = n / 10 ** exponent
  // Guard against 9.999 rounding up to 10.00.
  if (Number(mantissa.toFixed(digits)) >= 10) return { mantissa: (mantissa / 10).toFixed(digits), exponent: exponent + 1 }
  mantissa = Number(mantissa.toFixed(digits))
  return { mantissa: mantissa.toFixed(digits), exponent }
}

export function fmtScientificText(n: number): string {
  const { mantissa, exponent } = toScientific(n)
  return `${mantissa} × 10^${exponent}`
}

/** Millilitres below a litre, litres above. Never more precision than the model can justify. */
export function fmtVolume(ml: number): string {
  if (ml < 1000) return `${fmtNum(ml, ml < 10 ? 1 : 0)} mL`
  const liters = ml / 1000
  return `${fmtNum(liters, liters < 100 ? 1 : 0)} L`
}

export function fmtDuration(totalMinutes: number): string {
  const m = Math.round(totalMinutes)
  if (m < 60) return `${m} min`
  const days = Math.floor(m / 1440)
  const hours = Math.floor((m % 1440) / 60)
  const mins = m % 60
  if (days === 0) return mins ? `${hours} h ${mins} min` : `${hours} h`
  const dayPart = `${fmtInt(days)} ${days === 1 ? 'day' : 'days'}`
  return hours ? `${dayPart}, ${hours} h` : dayPart
}

/** Counts of hypothetical activities: one decimal for small numbers, grouped integers for big ones. */
export function fmtCount(n: number): string {
  if (n > 0 && n < 0.1) return '<0.1'
  if (n < 10) return fmtNum(n, 1)
  return fmtInt(n)
}

export function fmtPercent(fraction: number): string {
  const pct = fraction * 100
  if (pct > 0 && pct < 0.01) return '<0.01%'
  return `${fmtNum(pct, pct < 1 ? 2 : 1)}%`
}
