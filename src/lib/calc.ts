import {
  ACTIVITIES,
  AUTO_FREQUENT_THRESHOLD_PER_DAY,
  CALORIES,
  DAYS_PER_YEAR,
  FICTIONAL,
  SPERM_MILLIONS,
  VOLUME_ML,
} from './assumptions'
import { tierFor } from './copy/verdicts'
import type { AuditInput, AuditResult, Rates, Segment, SegmentResult } from './types'

/**
 * Expected sessions in one modeled year. Peak and off days are carved out first, so the
 * normal rate only ever applies to the remaining days and nothing is counted twice.
 */
export function sessionsPerYear(rates: Rates, offPerDay: number): number {
  const normalDays = DAYS_PER_YEAR - rates.peakDaysPerYear - rates.offDaysPerYear
  if (normalDays < 0) throw new RangeError('Peak days plus off days exceed one year')
  return normalDays * rates.normalPerDay + rates.peakDaysPerYear * rates.peakPerDay + rates.offDaysPerYear * offPerDay
}

/** Turns the form into non-overlapping age segments, clipped to [startAge, currentAge]. */
export function buildSegments(input: AuditInput): Segment[] {
  if (input.mode === 'simple') {
    return [{ label: 'Whole lore', fromAge: input.startAge, toAge: input.currentAge, ...pickRates(input) }]
  }
  const segments = input.eras
    .map((era) => ({
      label: era.label,
      fromAge: Math.max(era.fromAge, input.startAge),
      toAge: Math.min(era.toAge, input.currentAge),
      ...pickRates(era),
    }))
    .filter((s) => s.toAge > s.fromAge)
    .sort((a, b) => a.fromAge - b.fromAge)
  assertNoOverlap(segments)
  return segments
}

export function assertNoOverlap(segments: Pick<Segment, 'fromAge' | 'toAge' | 'label'>[]): void {
  const sorted = [...segments].sort((a, b) => a.fromAge - b.fromAge)
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]!
    const cur = sorted[i]!
    if (cur.fromAge < prev.toAge) {
      throw new RangeError(`Eras "${prev.label}" and "${cur.label}" overlap`)
    }
  }
}

function pickRates(r: Rates): Rates {
  return {
    normalPerDay: r.normalPerDay,
    peakPerDay: r.peakPerDay,
    peakDaysPerYear: r.peakDaysPerYear,
    offDaysPerYear: r.offDaysPerYear,
  }
}

export function resolveOutputPreset(input: AuditInput, avgPerDay: number) {
  if (input.outputPreset === 'custom') {
    return { preset: 'custom' as const, autoSelected: false, ml: input.customMl, sperm: input.customSpermMillions }
  }
  const preset =
    input.outputPreset === 'auto' ? (avgPerDay >= AUTO_FREQUENT_THRESHOLD_PER_DAY ? 'frequent' : 'median') : input.outputPreset
  return {
    preset,
    autoSelected: input.outputPreset === 'auto',
    ml: VOLUME_ML[preset].value,
    sperm: SPERM_MILLIONS[preset].value,
  }
}

export function fictionalMeter(sessions: number): number {
  if (sessions <= 0) return 0
  const ceiling = FICTIONAL.meterCeilingSessions.value
  return Math.min(100, Math.round((100 * Math.log10(1 + sessions)) / Math.log10(1 + ceiling)))
}

export function calculateAudit(input: AuditInput): AuditResult {
  const years = input.currentAge - input.startAge
  if (!(years >= 0)) throw new RangeError('Starting age is after current age')
  const modeledDays = years * DAYS_PER_YEAR

  const segments: SegmentResult[] = buildSegments(input).map((s) => {
    const segYears = s.toAge - s.fromAge
    return {
      label: s.label,
      fromAge: s.fromAge,
      toAge: s.toAge,
      years: segYears,
      days: segYears * DAYS_PER_YEAR,
      sessions: segYears * sessionsPerYear(s, input.offPerDay),
    }
  })

  const coveredDays = segments.reduce((sum, s) => sum + s.days, 0)
  const sessions = segments.reduce((sum, s) => sum + s.sessions, 0)
  const avgPerDay = modeledDays > 0 ? sessions / modeledDays : 0

  const out = resolveOutputPreset(input, avgPerDay)
  const totalMl = sessions * out.ml
  const spermCells = sessions * out.sperm * 1e6

  const minutes = sessions * input.minutesPerSession
  const calories = input.caloriesEnabled
    ? {
        kcalPerMinute: input.kcalPerMinute,
        kcal: minutes * input.kcalPerMinute,
        sittingKcal: minutes * CALORIES.sittingPerMinute70kg.value,
        extraKcal: Math.max(0, minutes * (input.kcalPerMinute - CALORIES.sittingPerMinute70kg.value)),
      }
    : null

  return {
    years,
    modeledDays,
    coveredDays,
    uncoveredYears: Math.max(0, (modeledDays - coveredDays) / DAYS_PER_YEAR),
    sessions,
    avgPerDay,
    segments,
    output: {
      preset: out.preset,
      autoSelected: out.autoSelected,
      mlPerSession: out.ml,
      spermMillionsPerSession: out.sperm,
      totalMl,
      totalLiters: totalMl / 1000,
      mlRange: [sessions * Math.min(out.ml, VOLUME_ML.p25.value), sessions * Math.max(out.ml, VOLUME_ML.p75.value)],
      spermRange: [
        sessions * Math.min(out.sperm, SPERM_MILLIONS.p25.value) * 1e6,
        sessions * Math.max(out.sperm, SPERM_MILLIONS.p75.value) * 1e6,
      ],
      spermCells,
    },
    time: {
      minutes,
      hours: minutes / 60,
      days: minutes / 1440,
      shareOfModeledTime: modeledDays > 0 ? minutes / (modeledDays * 1440) : 0,
      comparisons: ACTIVITIES.map((a) => ({
        id: a.id,
        label: a.label,
        count: minutes / a.minutes,
        minutesEach: a.minutes,
        basis: a.basis,
      })),
    },
    calories,
    fictional: {
      brainrotXP: Math.round(sessions * FICTIONAL.xpPerSession.value + minutes * FICTIONAL.xpPerMinute.value),
      auraLost: Math.round(sessions * FICTIONAL.auraPerSession.value),
      meter: fictionalMeter(sessions),
    },
    tier: tierFor(sessions),
  }
}
