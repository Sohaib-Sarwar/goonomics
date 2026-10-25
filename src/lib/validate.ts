import { DAYS_PER_YEAR, DEFAULT_MINUTES_PER_SESSION, type OutputPresetId, CALORIES } from './assumptions'
import type { Heat } from './copy/roasts'
import type { AuditInput, Era } from './types'

/** Raw form state: strings straight from inputs, so partially typed values never reach the engine. */
export interface EraForm {
  id: string
  label: string
  fromAge: string
  toAge: string
  normalPerDay: string
  peakPerDay: string
  peakDaysPerYear: string
  offDaysPerYear: string
}

export interface FormState {
  currentAge: string
  startAge: string
  normalPerDay: string
  peakPerDay: string
  peakDaysPerYear: string
  offDaysPerYear: string
  offPerDay: string
  minutesPerSession: string
  mode: 'simple' | 'eras'
  eras: EraForm[]
  outputPreset: OutputPresetId
  customMl: string
  customSpermMillions: string
  caloriesEnabled: boolean
  kcalPerMinute: string
  /** Roast intensity. Changes copy only, never the math. */
  heat: Heat
}

/** Shown when a daily rate goes above 17. The short form is used on narrow screens. */
export const OVER_LIMIT = 'HOW ARE YOU EVEN ALIVE? 💀 MAX IS 17. BRO, WE ARE CALCULATING, NOT SUMMONING THE FBI.'
export const OVER_LIMIT_SHORT = 'HOW ARE YOU EVEN ALIVE? 💀 Max is 17.'

export const LIMITS = {
  minAge: 18,
  maxAge: 110,
  minStartAge: 10,
  maxPerDay: 17,
  maxPeakPerDay: 17,
  maxMinutes: 240,
  maxEras: 8,
  maxLabel: 40,
  ml: [0.1, 15] as const,
  spermMillions: [1, 1500] as const,
  kcal: [0.1, 20] as const,
}

const MAX_SPECIAL_DAYS = Math.floor(DAYS_PER_YEAR)

let eraCounter = 0
export function newEra(label = '', fromAge = '', toAge = ''): EraForm {
  eraCounter += 1
  return {
    id: `era-${eraCounter}`,
    label,
    fromAge,
    toAge,
    normalPerDay: '',
    peakPerDay: '',
    peakDaysPerYear: '0',
    offDaysPerYear: '0',
  }
}

export const DEFAULT_ERA_LABELS = ['School era', 'University arc', 'Lock in era', 'Current era']

export function defaultForm(): FormState {
  return {
    currentAge: '',
    startAge: '',
    normalPerDay: '',
    peakPerDay: '',
    peakDaysPerYear: '0',
    offDaysPerYear: '0',
    offPerDay: '0',
    minutesPerSession: String(DEFAULT_MINUTES_PER_SESSION.value),
    mode: 'simple',
    eras: [],
    outputPreset: 'auto',
    customMl: '3',
    customSpermMillions: '210',
    caloriesEnabled: false,
    kcalPerMinute: String(CALORIES.illustrativeDefault.value),
    heat: 'medium',
  }
}

/** Splits [start, current] into up to four even eras, as a starting point the user can edit. */
export function suggestEras(startAge: number, currentAge: number): EraForm[] {
  const span = currentAge - startAge
  if (!(span > 0)) return [newEra(DEFAULT_ERA_LABELS[3], String(startAge), String(currentAge))]
  const count = Math.min(4, Math.max(1, span))
  const labels = DEFAULT_ERA_LABELS.slice(4 - count)
  const out: EraForm[] = []
  let from = startAge
  for (let i = 0; i < count; i++) {
    const to = i === count - 1 ? currentAge : Math.round(startAge + ((i + 1) * span) / count)
    out.push(newEra(labels[i], String(from), String(to)))
    from = to
  }
  return out
}

export type Errors = Record<string, string>

export interface ValidationResult {
  input: AuditInput | null
  errors: Errors
  warnings: string[]
}

type Parsed = { ok: true; value: number } | { ok: false; reason: 'missing' | 'nan' }

export function parseNumber(raw: string): Parsed {
  const s = raw.trim().replace(',', '.')
  if (s === '') return { ok: false, reason: 'missing' }
  if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s)) return { ok: false, reason: 'nan' }
  const value = Number(s)
  return Number.isFinite(value) ? { ok: true, value } : { ok: false, reason: 'nan' }
}

interface NumRule {
  min: number
  max: number
  integer?: boolean
  optional?: number
  messages: { missing: string; low: string; high: string; integer?: string }
}

function readNumber(raw: string, rule: NumRule, key: string, errors: Errors): number {
  const p = parseNumber(raw)
  if (!p.ok) {
    if (p.reason === 'missing' && rule.optional !== undefined) return rule.optional
    errors[key] = p.reason === 'missing' ? rule.messages.missing : 'Numbers only. The spreadsheet cannot do vibes.'
    return NaN
  }
  if (rule.integer && !Number.isInteger(p.value)) {
    errors[key] = rule.messages.integer ?? 'Whole numbers only for this one.'
    return NaN
  }
  if (p.value < rule.min) {
    errors[key] = rule.messages.low
    return NaN
  }
  if (p.value > rule.max) {
    errors[key] = rule.messages.high
    return NaN
  }
  return p.value
}

const rateRules = {
  normal: {
    min: 0,
    max: LIMITS.maxPerDay,
    messages: {
      missing: 'Slide it or type it. Zero counts.',
      low: 'Negative side quests are not a thing. We checked.',
      high: OVER_LIMIT,
    },
  },
  peak: {
    min: 0,
    max: LIMITS.maxPeakPerDay,
    messages: {
      missing: 'How many on a peak day?',
      low: 'Negative side quests are not a thing.',
      high: OVER_LIMIT,
    },
  },
  peakDays: {
    min: 0,
    max: MAX_SPECIAL_DAYS,
    integer: true,
    optional: 0,
    messages: { missing: '', low: 'Days cannot go below zero.', high: 'A year has 365 days. Even for the council.' },
  },
  offDays: {
    min: 0,
    max: MAX_SPECIAL_DAYS,
    integer: true,
    optional: 0,
    messages: { missing: '', low: 'Days cannot go below zero.', high: 'A year has 365 days.' },
  },
} satisfies Record<string, NumRule>

/** Shared checks for one set of rates (simple mode or one era). Keys are prefixed for eras. */
function readRates(
  src: { normalPerDay: string; peakPerDay: string; peakDaysPerYear: string; offDaysPerYear: string },
  prefix: string,
  errors: Errors,
) {
  const normalPerDay = readNumber(src.normalPerDay, rateRules.normal, `${prefix}normalPerDay`, errors)
  const peakDaysPerYear = readNumber(src.peakDaysPerYear, rateRules.peakDays, `${prefix}peakDaysPerYear`, errors)
  const offDaysPerYear = readNumber(src.offDaysPerYear, rateRules.offDays, `${prefix}offDaysPerYear`, errors)

  // Peak rate only matters when peak days exist; blank means "same as normal".
  const peakRaw = src.peakPerDay.trim()
  let peakPerDay = normalPerDay
  if (peakRaw !== '' || peakDaysPerYear > 0) {
    peakPerDay = readNumber(src.peakPerDay, rateRules.peak, `${prefix}peakPerDay`, errors)
    if (Number.isFinite(peakPerDay) && Number.isFinite(normalPerDay) && peakPerDay < normalPerDay) {
      errors[`${prefix}peakPerDay`] = 'Peak days need to beat a normal day. Otherwise they are just days.'
    }
  }

  if (Number.isFinite(peakDaysPerYear) && Number.isFinite(offDaysPerYear) && peakDaysPerYear + offDaysPerYear > MAX_SPECIAL_DAYS) {
    errors[`${prefix}offDaysPerYear`] = 'Peak days plus locked in days add up to more than a year. Something has to give.'
  }
  return { normalPerDay, peakPerDay, peakDaysPerYear, offDaysPerYear }
}

export function validateForm(form: FormState): ValidationResult {
  const errors: Errors = {}
  const warnings: string[] = []

  const currentAge = readNumber(
    form.currentAge,
    {
      min: LIMITS.minAge,
      max: LIMITS.maxAge,
      integer: true,
      messages: {
        missing: 'Need this one. It sets how long the lore runs.',
        low: 'This audit is for adults (18+).',
        high: `The audit tops out at ${LIMITS.maxAge}. Respect to the elders, though.`,
        integer: 'Whole years. Nobody is 24.5 on a form.',
      },
    },
    'currentAge',
    errors,
  )
  const startAge = readNumber(
    form.startAge,
    {
      min: LIMITS.minStartAge,
      max: LIMITS.maxAge,
      integer: true,
      messages: {
        missing: 'When did the lore begin? A rough guess is fine.',
        low: `The audit starts counting at ${LIMITS.minStartAge}.`,
        high: 'That starting age is beyond the audit range.',
        integer: 'Whole years only.',
      },
    },
    'startAge',
    errors,
  )
  if (Number.isFinite(currentAge) && Number.isFinite(startAge) && startAge > currentAge) {
    errors.startAge = 'The lore cannot start after your current age. Time travel is a separate audit.'
  }

  const simpleRates =
    form.mode === 'simple'
      ? readRates(form, '', errors)
      : { normalPerDay: 0, peakPerDay: 0, peakDaysPerYear: 0, offDaysPerYear: 0 }

  const offPerDay = readNumber(
    form.offPerDay,
    {
      min: 0,
      max: LIMITS.maxPerDay,
      optional: 0,
      messages: { missing: '', low: 'Negative side quests are not a thing.', high: 'Locked in days should be quieter than that.' },
    },
    'offPerDay',
    errors,
  )
  if (form.mode === 'simple' && Number.isFinite(offPerDay) && Number.isFinite(simpleRates.normalPerDay) && offPerDay > simpleRates.normalPerDay) {
    errors.offPerDay = 'Locked in days should be quieter than normal days. That is the whole point.'
  }

  const minutesPerSession = readNumber(
    form.minutesPerSession,
    {
      min: 1,
      max: LIMITS.maxMinutes,
      messages: {
        missing: 'Pick a session length for the time math.',
        low: 'At least one minute, please.',
        high: 'Over four hours? Use an average, not a personal best.',
      },
    },
    'minutesPerSession',
    errors,
  )

  let customMl = 0
  let customSpermMillions = 0
  if (form.outputPreset === 'custom') {
    customMl = readNumber(
      form.customMl,
      {
        min: LIMITS.ml[0],
        max: LIMITS.ml[1],
        messages: { missing: 'Enter mL per session.', low: 'Too small to model.', high: `Capped at ${LIMITS.ml[1]} mL.` },
      },
      'customMl',
      errors,
    )
    customSpermMillions = readNumber(
      form.customSpermMillions,
      {
        min: LIMITS.spermMillions[0],
        max: LIMITS.spermMillions[1],
        messages: {
          missing: 'Enter millions of sperm per session.',
          low: 'At least 1 million.',
          high: `Capped at ${LIMITS.spermMillions[1]} million.`,
        },
      },
      'customSpermMillions',
      errors,
    )
  }

  const kcalPerMinute = form.caloriesEnabled
    ? readNumber(
        form.kcalPerMinute,
        {
          min: LIMITS.kcal[0],
          max: LIMITS.kcal[1],
          messages: { missing: 'Enter your calories per minute guess.', low: 'Too small to model.', high: `Capped at ${LIMITS.kcal[1]}.` },
        },
        'kcalPerMinute',
        errors,
      )
    : 0

  const eras: Era[] = []
  if (form.mode === 'eras') {
    if (form.eras.length === 0) errors.eras = 'Add at least one era, or switch eras off.'
    if (form.eras.length > LIMITS.maxEras) errors.eras = `Up to ${LIMITS.maxEras} eras. Even sagas need an ending.`
    for (const ef of form.eras) {
      const p = `eras.${ef.id}.`
      const label = ef.label.trim()
      if (!label) errors[`${p}label`] = 'Give this era a name.'
      else if (label.length > LIMITS.maxLabel) errors[`${p}label`] = `Keep it under ${LIMITS.maxLabel} characters.`
      const ageRule = (which: string): NumRule => ({
        min: LIMITS.minStartAge,
        max: LIMITS.maxAge,
        integer: true,
        messages: { missing: `${which} age needed.`, low: 'Too early for the audit.', high: 'Beyond the audit range.' },
      })
      const fromAge = readNumber(ef.fromAge, ageRule('Start'), `${p}fromAge`, errors)
      const toAge = readNumber(ef.toAge, ageRule('End'), `${p}toAge`, errors)
      if (Number.isFinite(fromAge) && Number.isFinite(toAge) && toAge <= fromAge) {
        errors[`${p}toAge`] = 'An era has to end after it starts.'
      }
      if (Number.isFinite(startAge) && Number.isFinite(fromAge) && fromAge < startAge) {
        errors[`${p}fromAge`] = 'Starts before your lore began.'
      }
      if (Number.isFinite(currentAge) && Number.isFinite(toAge) && toAge > currentAge) {
        errors[`${p}toAge`] = 'Ends after your current age.'
      }
      const rates = readRates(ef, p, errors)
      eras.push({ id: ef.id, label: label || 'Untitled era', fromAge, toAge, ...rates })
    }
    // Overlap check across every pair, so each year belongs to at most one era.
    const valid = eras.filter((e) => Number.isFinite(e.fromAge) && Number.isFinite(e.toAge) && e.toAge > e.fromAge)
    for (let i = 0; i < valid.length; i++) {
      for (let j = i + 1; j < valid.length; j++) {
        const a = valid[i]!
        const b = valid[j]!
        if (a.fromAge < b.toAge && b.fromAge < a.toAge) {
          errors[`eras.${b.id}.fromAge`] = `Overlaps with “${a.label}”. Each year can only belong to one era.`
        }
      }
    }
    if (Number.isFinite(currentAge) && Number.isFinite(startAge) && valid.length) {
      const covered = valid.reduce((sum, e) => sum + (Math.min(e.toAge, currentAge) - Math.max(e.fromAge, startAge)), 0)
      const gap = currentAge - startAge - covered
      if (gap > 0) warnings.push(`${gap} ${gap === 1 ? 'year is' : 'years are'} not covered by any era and will count as zero.`)
    }
  }

  if (Object.keys(errors).length > 0) return { input: null, errors, warnings }

  return {
    input: {
      currentAge,
      startAge,
      mode: form.mode,
      ...simpleRates,
      offPerDay,
      eras,
      minutesPerSession,
      outputPreset: form.outputPreset,
      customMl,
      customSpermMillions,
      caloriesEnabled: form.caloriesEnabled,
      kcalPerMinute,
    },
    errors,
    warnings,
  }
}
