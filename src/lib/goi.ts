import type { AuditResult } from './types'

/**
 * GOI, the Goonomics Index: an entertainment score from 300 to 850, shaped like a credit score.
 * It does not measure health, habits, fertility or character.
 *
 *   volume    = log10(1 + lifetime sessions) / log10(1 + 50,000), capped at 1
 *   intensity = log10(1 + sessions per day) / log10(1 + 4), capped at 1
 *   GOI       = round(300 + 550 × (0.75 × volume + 0.25 × intensity))
 *
 * Deterministic: the same result always gives the same score.
 */
export const GOI_MIN = 300
export const GOI_MAX = 850
const VOLUME_CEILING = 50_000
const INTENSITY_CEILING = 4

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export function goiScore(result: Pick<AuditResult, 'sessions' | 'avgPerDay'>): number {
  const volume = clamp01(Math.log10(1 + Math.max(0, result.sessions)) / Math.log10(1 + VOLUME_CEILING))
  const intensity = clamp01(Math.log10(1 + Math.max(0, result.avgPerDay)) / Math.log10(1 + INTENSITY_CEILING))
  return Math.round(GOI_MIN + (GOI_MAX - GOI_MIN) * (0.75 * volume + 0.25 * intensity))
}

export const GOI_BANDS: { min: number; label: string; blurb: string }[] = [
  { min: 300, label: 'Touch grass champion', blurb: 'Barely any lore. The council is suspicious but impressed.' },
  { min: 400, label: 'Side quest enjoyer', blurb: 'Casual numbers. Main story still intact.' },
  { min: 500, label: 'Lore archivist', blurb: 'Solid lore. The filing cabinet has a second drawer.' },
  { min: 600, label: 'Down bad researcher', blurb: 'Serious documentation. The intern asked for a raise.' },
  { min: 700, label: 'Final boss behaviour', blurb: 'Two health bars and a cutscene.' },
  { min: 800, label: 'The spreadsheet has resigned', blurb: 'Lore beyond containment. HR is involved.' },
]

export function goiBand(score: number): string {
  let label = GOI_BANDS[0]!.label
  for (const b of GOI_BANDS) if (score >= b.min) label = b.label
  return label
}
