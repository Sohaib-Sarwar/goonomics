/**
 * Verdict tiers by estimated lifetime sessions. Thresholds are entertainment categories, not
 * clinical cut-offs: a big number is not a diagnosis, and a small one is not a gold star.
 */
export type Reaction = 'audit' | 'sweat' | 'shock' | 'party' | 'void' | 'professor' | 'stamp'

export interface Verdict {
  minSessions: number
  name: string
  blurb: string
  stamp: string
  reaction: Reaction
}

export const VERDICTS: Verdict[] = [
  { minSessions: 0, name: 'Certified Monk Mode', blurb: 'Zero entries. The council is checking if the form is broken.', stamp: 'Clean', reaction: 'professor' },
  { minSessions: 1, name: 'Tutorial Level Intern', blurb: 'Pressed a few buttons, then went outside. Respect.', stamp: 'Trainee', reaction: 'audit' },
  { minSessions: 100, name: 'Casual Side Quester', blurb: 'Does the side quest, returns to the main story. Healthy pacing.', stamp: 'Noted', reaction: 'audit' },
  { minSessions: 1_000, name: 'The Lore Archivist', blurb: 'Four digits. The filing cabinet needs a second drawer.', stamp: 'Archived', reaction: 'professor' },
  { minSessions: 3_000, name: 'Down Bad Research Fellow', blurb: 'Fellowship granted. The department respects the dedication.', stamp: 'Funded', reaction: 'sweat' },
  { minSessions: 6_000, name: 'Head of Questionable Time Management', blurb: 'A whole department. No budget. One employee. It is you.', stamp: 'Under review', reaction: 'sweat' },
  { minSessions: 10_000, name: 'Spreadsheet Final Boss', blurb: 'Five digits. Excel asked if you were sure.', stamp: 'Cooked', reaction: 'shock' },
  { minSessions: 15_000, name: 'CEO of Unnecessary Statistics', blurb: 'Board meetings are quarterly. Minutes are being taken. Unfortunately.', stamp: 'Well done', reaction: 'stamp' },
  { minSessions: 25_000, name: 'Tenured Professor of Brainrot', blurb: 'Tenure means they cannot fire you. They checked.', stamp: 'Tenured', reaction: 'void' },
  { minSessions: 50_000, name: 'Emergency Council Session', blurb: 'The council convened. Nobody is in trouble. Everyone is curious.', stamp: 'Burnt', reaction: 'shock' },
]

export function tierFor(sessions: number): number {
  if (!(sessions > 0)) return 0
  let tier = 0
  for (let i = 0; i < VERDICTS.length; i++) {
    if (sessions >= VERDICTS[i]!.minSessions) tier = i
  }
  // Anything above zero is at least the intern tier, even 0.4 modeled sessions.
  return Math.max(1, tier)
}

/** Coarse band used to route roasts, headlines and captions. */
export type Band = 'zero' | 'low' | 'mid' | 'high' | 'max'

export function bandFor(tier: number): Band {
  if (tier === 0) return 'zero'
  if (tier <= 2) return 'low'
  if (tier <= 5) return 'mid'
  if (tier <= 7) return 'high'
  return 'max'
}
