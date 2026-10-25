import type { OutputPresetId } from './assumptions'

/** Rates for one stretch of life. "normalPerDay" applies only to days that are neither peak nor off days. */
export interface Rates {
  normalPerDay: number
  peakPerDay: number
  peakDaysPerYear: number
  offDaysPerYear: number
}

export interface Era extends Rates {
  id: string
  label: string
  fromAge: number
  toAge: number
}

export interface AuditInput extends Rates {
  currentAge: number
  startAge: number
  mode: 'simple' | 'eras'
  /** Sessions per day on "off" days. 0 = fully inactive, anything else = reduced activity. */
  offPerDay: number
  eras: Era[]
  minutesPerSession: number
  outputPreset: OutputPresetId
  customMl: number
  customSpermMillions: number
  caloriesEnabled: boolean
  kcalPerMinute: number
}

export interface Segment extends Rates {
  label: string
  fromAge: number
  toAge: number
}

export interface SegmentResult {
  label: string
  fromAge: number
  toAge: number
  years: number
  days: number
  sessions: number
}

export interface AuditResult {
  years: number
  modeledDays: number
  coveredDays: number
  uncoveredYears: number
  sessions: number
  avgPerDay: number
  segments: SegmentResult[]
  output: {
    preset: Exclude<OutputPresetId, 'auto'>
    autoSelected: boolean
    mlPerSession: number
    spermMillionsPerSession: number
    totalMl: number
    totalLiters: number
    mlRange: [number, number]
    spermCells: number
    spermRange: [number, number]
  }
  time: {
    minutes: number
    hours: number
    days: number
    shareOfModeledTime: number
    comparisons: { id: string; label: string; count: number; minutesEach: number; basis: string }[]
  }
  calories: null | {
    kcalPerMinute: number
    kcal: number
    sittingKcal: number
    extraKcal: number
  }
  fictional: {
    brainrotXP: number
    auraLost: number
    meter: number
  }
  tier: number
}
