import type { SourceId } from './sources'

/**
 * Every number the calculator multiplies by lives here, tagged with what kind of number it is.
 * "reference-limit" values are deliberately NOT used as defaults: a 5th centile is not an average.
 */
export type AssumptionKind = 'population-median' | 'measured-average' | 'reference-limit' | 'selected-assumption' | 'fictional'

export interface Assumption {
  value: number
  unit: string
  kind: AssumptionKind
  sources: SourceId[]
  note: string
}

/** Mean Gregorian year. Ages are whole years, so leap days are averaged rather than enumerated. */
export const DAYS_PER_YEAR = 365.2425

export const VOLUME_ML = {
  median: {
    value: 3.0,
    unit: 'mL per ejaculate',
    kind: 'population-median',
    sources: ['who2021', 'campbell2021', 'mftTable'],
    note: '50th centile of 3,586 men whose partners conceived within a year, after 2–7 days of abstinence. Real people vary a lot around this.',
  },
  p25: { value: 2.3, unit: 'mL', kind: 'population-median', sources: ['mftTable'], note: '25th centile, same dataset.' },
  p75: { value: 4.2, unit: 'mL', kind: 'population-median', sources: ['mftTable'], note: '75th centile, same dataset.' },
  referenceLimit: {
    value: 1.4,
    unit: 'mL',
    kind: 'reference-limit',
    sources: ['who2021', 'mftTable'],
    note: '5th centile. A clinical lower reference limit, not what a typical person produces. Shown for context only.',
  },
  frequent: {
    value: 1.8,
    unit: 'mL per ejaculate',
    kind: 'measured-average',
    sources: ['mayorga2015'],
    note: 'Average of days 2–13 during two weeks of daily ejaculation (baseline was 2.5 mL). Tiny study: six men.',
  },
} as const satisfies Record<string, Assumption>

export const SPERM_MILLIONS = {
  median: {
    value: 210,
    unit: 'million sperm per ejaculate',
    kind: 'population-median',
    sources: ['who2021', 'campbell2021', 'mftTable'],
    note: '50th centile of total sperm number (not concentration per mL). Same 2–7-day-abstinence dataset.',
  },
  p25: { value: 108, unit: 'million', kind: 'population-median', sources: ['mftTable'], note: '25th centile.' },
  p75: { value: 363, unit: 'million', kind: 'population-median', sources: ['mftTable'], note: '75th centile.' },
  referenceLimit: {
    value: 39,
    unit: 'million',
    kind: 'reference-limit',
    sources: ['who2021', 'mftTable'],
    note: '5th centile lower reference limit. Context only, never used as an average.',
  },
  frequent: {
    value: 115,
    unit: 'million sperm per ejaculate',
    kind: 'measured-average',
    sources: ['mayorga2015'],
    note: 'Average of days 2–13 of daily ejaculation (baseline was 277 million). Six men, so treat it as a rough hint.',
  },
} as const satisfies Record<string, Assumption>

/** Concentration is a different quantity (per mL). Shown so nobody multiplies the wrong thing. */
export const CONCENTRATION_MEDIAN: Assumption = {
  value: 66,
  unit: 'million per mL',
  kind: 'population-median',
  sources: ['mftTable'],
  note: 'Median concentration. Total per ejaculate = concentration × volume, which is why we use the total-number column directly.',
}

export type OutputPresetId = 'auto' | 'frequent' | 'median' | 'custom'

/**
 * "auto" picks the frequent-ejaculation values when the modeled average is at least this many
 * sessions per day. Our own threshold (selected assumption), matched to the daily-ejaculation study design.
 */
export const AUTO_FREQUENT_THRESHOLD_PER_DAY = 1

export const DEFAULT_MINUTES_PER_SESSION: Assumption = {
  value: 15,
  unit: 'minutes per session',
  kind: 'selected-assumption',
  sources: [],
  note: 'We found no reliable population data. Pick your own; the time audit scales with it.',
}

export const CALORIES = {
  illustrativeDefault: {
    value: 2,
    unit: 'kcal per minute',
    kind: 'selected-assumption',
    sources: ['compendiumSex'],
    note: 'Pure guess. The Compendium of Physical Activities has no entry for solo activity and no study we found measured it.',
  },
  sittingPerMinute70kg: {
    value: 70 / 60,
    unit: 'kcal per minute',
    kind: 'selected-assumption',
    sources: ['compendium2024'],
    note: '1 MET ≈ 1 kcal per kg per hour (sitting quietly), for a 70 kg adult. You would burn this anyway.',
  },
  partneredMenPerMinute: {
    value: 4.2,
    unit: 'kcal per minute',
    kind: 'measured-average',
    sources: ['frappier2013'],
    note: 'Partnered sex, 21 young couples, armband-measured. Different activity, context only.',
  },
} as const satisfies Record<string, Assumption>

/** Fictional metrics. Labelled as such everywhere they appear. */
export const FICTIONAL = {
  auraPerSession: { value: 6.7, unit: 'aura points', kind: 'fictional', sources: [], note: 'Industry standard. The industry is us.' },
  xpPerSession: { value: 10, unit: 'brainrot XP', kind: 'fictional', sources: [], note: 'Made up.' },
  xpPerMinute: { value: 0.5, unit: 'brainrot XP', kind: 'fictional', sources: [], note: 'Also made up.' },
  meterCeilingSessions: {
    value: 50_000,
    unit: 'sessions',
    kind: 'fictional',
    sources: [],
    note: 'Where the meter maxes out on a log scale.',
  },
} as const satisfies Record<string, Assumption>

export interface Activity {
  id: string
  label: string
  minutes: number
  basis: string
}

/** Hypothetical alternative uses of the modeled time. All durations are assumptions we state. */
export const ACTIVITIES: Activity[] = [
  { id: 'novel', label: 'novels', minutes: 378, basis: '90,000-word novel at 238 words/min (Brysbaert 2019 adult average)' },
  { id: 'lesson', label: 'beginner coding lessons', minutes: 30, basis: 'assumed 30 min each' },
  { id: 'language', label: 'bite-size language lessons', minutes: 5, basis: 'assumed 5 min each' },
  { id: 'sitcom', label: 'sitcom episodes', minutes: 22, basis: 'assumed 22 min each' },
  { id: 'drama', label: 'prestige-drama episodes', minutes: 50, basis: 'assumed 50 min each' },
  { id: 'pomodoro', label: 'pomodoro study blocks', minutes: 25, basis: '25-minute pomodoro' },
  { id: 'film', label: 'feature films', minutes: 120, basis: 'assumed 2 h each' },
  { id: 'trilogy', label: 'extended-edition fantasy trilogy marathons', minutes: 686, basis: 'assumed ~11.4 h per marathon' },
  { id: 'marathon', label: 'actual marathons (the running kind)', minutes: 270, basis: 'assumed 4 h 30 min recreational finish' },
  { id: 'gym', label: 'gym sessions', minutes: 60, basis: 'assumed 1 h each' },
  { id: 'podcast', label: 'hour-long podcast episodes', minutes: 60, basis: 'assumed 1 h each' },
  { id: 'guitar', label: 'guitar practice sessions', minutes: 30, basis: 'assumed 30 min each' },
  { id: 'nap', label: 'power naps', minutes: 20, basis: 'assumed 20 min each' },
  { id: 'flight', label: 'London to New York flights', minutes: 480, basis: 'assumed ~8 h gate to gate' },
  { id: 'workweek', label: '40-hour work weeks', minutes: 2400, basis: '40 h each' },
]
