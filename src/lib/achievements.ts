import type { AuditInput, AuditResult } from './types'

/**
 * Fictional achievements with documented thresholds. They describe the modeled numbers,
 * never health, habits or character. Order is display order (rarest first among unlocked).
 */
export interface Achievement {
  id: string
  name: string
  rule: string
  unlocked: (r: AuditResult, i: AuditInput) => boolean
}

const anyRates = (i: AuditInput) => (i.mode === 'eras' ? i.eras : [i])

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'council', name: 'The council knows', rule: '25,000 or more lifetime sessions', unlocked: (r) => r.sessions >= 25_000 },
  { id: 'boss', name: 'Final boss energy', rule: '10,000 or more lifetime sessions', unlocked: (r) => r.sessions >= 10_000 },
  { id: 'sidequester', name: 'Professional side quester', rule: '1,000 or more hours of modeled time', unlocked: (r) => r.time.hours >= 1_000 },
  { id: 'cinema', name: 'Absolute cinema', rule: 'Modeled time of 100 feature films or more (12,000 minutes)', unlocked: (r) => r.time.minutes >= 12_000 },
  { id: 'unc', name: 'Unc status', rule: 'Lore running 20 years or more', unlocked: (r) => r.years >= 20 },
  { id: 'grass', name: 'Touch grass optional', rule: 'Average of one or more sessions per day', unlocked: (r) => r.avgPerDay >= 1 },
  {
    id: 'peak',
    name: 'Peak season',
    rule: '30 or more peak days a year at double the regular rate or higher',
    unlocked: (_r, i) => anyRates(i).some((e) => e.peakDaysPerYear >= 30 && e.peakPerDay >= 2 * e.normalPerDay && e.peakPerDay > 0),
  },
  { id: 'lockedin', name: 'Actually locked in', rule: '100 or more zero activity days a year', unlocked: (_r, i) => anyRates(i).some((e) => e.offDaysPerYear >= 100) },
  { id: 'eras', name: 'Era enjoyer', rule: 'Three or more eras modeled', unlocked: (r, i) => i.mode === 'eras' && r.segments.length >= 3 },
  { id: 'survivor', name: 'Spreadsheet survivor', rule: '1,000 or more lifetime sessions', unlocked: (r) => r.sessions >= 1_000 },
  { id: 'lore', name: 'Lore unlocked', rule: 'Any sessions at all', unlocked: (r) => r.sessions > 0 },
  { id: 'monk', name: 'Monk mode', rule: 'Exactly zero sessions', unlocked: (r) => r.sessions === 0 },
]

export function unlockedAchievements(result: AuditResult, input: AuditInput): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.unlocked(result, input))
}
