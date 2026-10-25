import { fmtBigWords, fmtDuration, fmtInt, fmtVolume } from './format'
import type { AuditResult } from './types'

/** Everything the single master card can show. The user picks; the numbers never change. */
export type CardField = 'goi' | 'badge' | 'verdict' | 'sessions' | 'volume' | 'swimmers' | 'time' | 'xp' | 'roast' | 'achievement'

export const CARD_FIELDS: CardField[] = ['goi', 'badge', 'verdict', 'sessions', 'volume', 'swimmers', 'time', 'xp', 'roast', 'achievement']

/** Privacy conscious default: the jokes and the fictional score, no personal statistics. */
export const RECOMMENDED_FIELDS: CardField[] = ['goi', 'badge', 'verdict', 'roast', 'achievement']

export const STAT_FIELDS = ['sessions', 'volume', 'swimmers', 'time', 'xp'] as const
export type StatField = (typeof STAT_FIELDS)[number]

export const CARD_SIZE = { width: 1080, height: 1920 }

export function statFor(field: StatField, r: AuditResult): { value: string; label: string } {
  switch (field) {
    case 'sessions':
      return { value: fmtInt(r.sessions), label: 'lifetime sessions' }
    case 'volume':
      return { value: fmtVolume(r.output.totalMl), label: 'estimated volume' }
    case 'swimmers':
      return { value: fmtBigWords(r.output.spermCells), label: 'swimmers. Cells, not kids.' }
    case 'time':
      return { value: fmtDuration(r.time.minutes), label: 'side quest time' }
    case 'xp':
      return { value: fmtInt(r.fictional.brainrotXP), label: 'brainrot XP, fictional' }
  }
}

/**
 * Sizes for the master card, chosen from how much is selected so text never clips: fewer
 * fields get bigger type and a bigger reaction; more fields compress everything evenly.
 */
export function cardLayout(fields: CardField[], roast: string, verdict: string) {
  const stats = STAT_FIELDS.filter((f) => fields.includes(f)).length
  const extras = (fields.includes('roast') ? 1 : 0) + (fields.includes('achievement') ? 1 : 0) + (fields.includes('goi') || fields.includes('badge') ? 1 : 0)
  const load = stats + extras + (fields.includes('verdict') ? 1 : 0)
  const verdictSize = Math.round((verdict.length <= 16 ? 150 : verdict.length <= 26 ? 124 : 104) * (load >= 7 ? 0.82 : 1))
  const roastSize = Math.round((roast.length <= 50 ? 66 : roast.length <= 80 ? 58 : 50) * (load >= 7 ? 0.82 : 1))
  const statSize = stats <= 1 ? 120 : stats === 2 ? 92 : stats <= 4 ? 70 : 60
  const reaction = load <= 3 ? 640 : load <= 5 ? 500 : load <= 7 ? 380 : 300
  return { stats, verdictSize, roastSize, statSize, reaction, goiSize: load <= 4 ? 132 : 96 }
}
