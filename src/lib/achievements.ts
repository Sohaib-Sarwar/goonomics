import type { AuditInput, AuditResult } from './types'

/**
 * Achievement badges, grouped into gooning categories. Fictional, with documented thresholds;
 * they describe the modeled numbers, never health, habits or character. Display order puts the
 * rarest first.
 */
export type BadgeCategory = 'Grind' | 'Time sink' | 'Frequency' | 'Lore' | 'Discipline' | 'Chaos'

export const BADGE_CATEGORIES: { id: BadgeCategory; blurb: string }[] = [
  { id: 'Grind', blurb: 'Lifetime session milestones.' },
  { id: 'Time sink', blurb: 'How much modeled time went to the side quest.' },
  { id: 'Frequency', blurb: 'How often, on average.' },
  { id: 'Lore', blurb: 'How long the lore has been running.' },
  { id: 'Discipline', blurb: 'Days spent actually locked in.' },
  { id: 'Chaos', blurb: 'Peaks, eras and plot twists.' },
]

export interface Achievement {
  id: string
  name: string
  category: BadgeCategory
  rule: string
  unlocked: (r: AuditResult, i: AuditInput) => boolean
}

const anyRates = (i: AuditInput) => (i.mode === 'eras' ? i.eras : [i])

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'council', name: 'The council knows', category: 'Grind', rule: '25,000 or more lifetime sessions', unlocked: (r) => r.sessions >= 25_000 },
  { id: 'og', name: 'OG Gooner', category: 'Lore', rule: 'Lore running 30 years or more', unlocked: (r) => r.years >= 30 && r.sessions > 0 },
  { id: 'speedrun', name: 'Speedrunner', category: 'Frequency', rule: 'Average of four or more sessions a day', unlocked: (r) => r.avgPerDay >= 4 },
  { id: 'boss', name: 'Final boss energy', category: 'Grind', rule: '10,000 or more lifetime sessions', unlocked: (r) => r.sessions >= 10_000 },
  { id: 'sidequester', name: 'Professional side quester', category: 'Time sink', rule: '1,000 or more hours of modeled time', unlocked: (r) => r.time.hours >= 1_000 },
  { id: 'cinema', name: 'Absolute cinema', category: 'Time sink', rule: 'Modeled time of 100 feature films or more (12,000 minutes)', unlocked: (r) => r.time.minutes >= 12_000 },
  { id: 'unc', name: 'Unc status', category: 'Lore', rule: 'Lore running 20 years or more', unlocked: (r) => r.years >= 20 },
  { id: 'double', name: 'Double tap', category: 'Frequency', rule: 'Average of two or more sessions a day', unlocked: (r) => r.avgPerDay >= 2 },
  { id: 'grass', name: 'Touch grass optional', category: 'Frequency', rule: 'Average of one or more sessions a day', unlocked: (r) => r.avgPerDay >= 1 },
  {
    id: 'peak',
    name: 'Peak season',
    category: 'Chaos',
    rule: '30 or more peak days a year at double the regular rate or higher',
    unlocked: (_r, i) => anyRates(i).some((e) => e.peakDaysPerYear >= 30 && e.peakPerDay >= 2 * e.normalPerDay && e.peakPerDay > 0),
  },
  { id: 'lockedin', name: 'Actually locked in', category: 'Discipline', rule: '100 or more zero activity days a year', unlocked: (_r, i) => anyRates(i).some((e) => e.offDaysPerYear >= 100) },
  { id: 'eras', name: 'Era enjoyer', category: 'Chaos', rule: 'Three or more eras modeled', unlocked: (r, i) => i.mode === 'eras' && r.segments.length >= 3 },
  { id: 'survivor', name: 'Spreadsheet survivor', category: 'Grind', rule: '1,000 or more lifetime sessions', unlocked: (r) => r.sessions >= 1_000 },
  { id: 'lore', name: 'Lore unlocked', category: 'Grind', rule: 'Any sessions at all', unlocked: (r) => r.sessions > 0 },
  { id: 'monk', name: 'Monk mode', category: 'Discipline', rule: 'Exactly zero sessions', unlocked: (r) => r.sessions === 0 },
]

export function unlockedAchievements(result: AuditResult, input: AuditInput): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.unlocked(result, input))
}
