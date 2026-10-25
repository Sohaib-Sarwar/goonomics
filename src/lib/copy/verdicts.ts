/**
 * Verdict tiers by estimated lifetime sessions. Thresholds are entertainment categories, not
 * clinical cut-offs: a big number is not a diagnosis, and a small one is not a gold star.
 */
export type MascotMood = 'suspicious' | 'shocked' | 'graduate' | 'textbook' | 'buried' | 'stamp'

export interface Verdict {
  minSessions: number
  name: string
  blurb: string
  stamp: string
  /** Mascot pose: real mascot art plus an SVG prop or CSS motion (see components/Mascot.tsx). */
  mood: MascotMood
}

export const VERDICTS: Verdict[] = [
  {
    minSessions: 0,
    name: 'The Blank Ledger',
    blurb: 'Zero entries. Either you are on a monk arc or you are trolling the council. Both are valid lore.',
    stamp: 'Nothing filed',
    mood: 'suspicious',
  },
  {
    minSessions: 1,
    name: 'The Tutorial-Level Intern',
    blurb: 'You found the controls, pressed a few buttons, and went back outside. Minimal paperwork. Suspicious amounts of grass.',
    stamp: 'Trainee',
    mood: 'textbook',
  },
  {
    minSessions: 100,
    name: 'The Casual Side-Quest Enjoyer',
    blurb: 'You do the side quest now and then and return to the main story. Healthy pacing. Boring spreadsheet.',
    stamp: 'Casual',
    mood: 'suspicious',
  },
  {
    minSessions: 1_000,
    name: 'The Lore Archivist',
    blurb: 'Four digits. The filing cabinet now needs a second drawer and a labeling system.',
    stamp: 'Archived',
    mood: 'textbook',
  },
  {
    minSessions: 3_000,
    name: 'The Down-Bad Research Fellow',
    blurb: 'Fellowship granted. The department respects your commitment to primary research.',
    stamp: 'Funded',
    mood: 'graduate',
  },
  {
    minSessions: 6_000,
    name: 'Department Head of Questionable Time Management',
    blurb: 'You now run a whole department. The department has no budget and one employee. It is you.',
    stamp: 'Under review',
    mood: 'suspicious',
  },
  {
    minSessions: 10_000,
    name: 'The Spreadsheet Final Boss',
    blurb: 'Five digits. Excel asked if you were sure. You were sure.',
    stamp: 'Escalated',
    mood: 'shocked',
  },
  {
    minSessions: 15_000,
    name: 'CEO of Unnecessary Statistics',
    blurb: 'Board meetings are held quarterly. Attendance is mandatory. Minutes are, unfortunately, being taken.',
    stamp: 'Board approved',
    mood: 'stamp',
  },
  {
    minSessions: 25_000,
    name: 'Tenured Professor of Brainrot',
    blurb: 'Tenure means they cannot fire you. They have looked into it anyway.',
    stamp: 'Tenured',
    mood: 'graduate',
  },
  {
    minSessions: 50_000,
    name: 'Subject of an Emergency Council Session',
    blurb: 'The council has convened. Nobody is in trouble. Everyone is just extremely curious.',
    stamp: 'Council',
    mood: 'buried',
  },
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

/** Coarse band used to route roasts and headlines. */
export type Band = 'zero' | 'low' | 'mid' | 'high' | 'max'

export function bandFor(tier: number): Band {
  if (tier === 0) return 'zero'
  if (tier <= 2) return 'low'
  if (tier <= 5) return 'mid'
  if (tier <= 7) return 'high'
  return 'max'
}
