/**
 * Rank badges, earned from the GOI (300 to 850). Entertainment only: they rank the audit,
 * never health, habits or worth. Emblem art: public/assets/badge-*.webp (Higgsfield, cut by
 * `npm run badges`); the name is always live text.
 */
export interface RankBadge {
  id: 'grass' | 'rookie' | 'farmer' | 'lord' | 'legend' | 'peak' | 'ultimate'
  min: number
  name: string
  tagline: string
  /** Accent used for the badge name and glow. */
  tone: string
  art: string
}

export const RANK_BADGES: RankBadge[] = [
  { id: 'grass', min: 300, name: 'Touch Grass Certified', tagline: 'Barely any lore. The council is suspicious but impressed.', tone: '#7bd88f', art: '/assets/badge-grass.webp' },
  { id: 'rookie', min: 400, name: 'Side Quest Rookie', tagline: 'Casual numbers. Main story still intact.', tone: '#d79b62', art: '/assets/badge-rookie.webp' },
  { id: 'farmer', min: 480, name: 'Aura Farmer', tagline: 'Farming aura one session at a time.', tone: '#c9ccd6', art: '/assets/badge-farmer.webp' },
  { id: 'lord', min: 560, name: 'Lore Lord', tagline: 'Serious documentation. The intern asked for a raise.', tone: '#f2c94c', art: '/assets/badge-lord.webp' },
  { id: 'legend', min: 640, name: 'Aura Legend', tagline: 'Your aura has its own fan page.', tone: '#c5ff5c', art: '/assets/badge-legend.webp' },
  { id: 'peak', min: 720, name: 'Peak Gooner', tagline: 'Two health bars and a cutscene.', tone: '#b388ff', art: '/assets/badge-peak.webp' },
  { id: 'ultimate', min: 800, name: 'Ultimate Gooner', tagline: 'Lore beyond containment. The spreadsheet has resigned.', tone: '#ff8a3d', art: '/assets/badge-ultimate.webp' },
]

export function rankBadge(goi: number): RankBadge {
  let badge = RANK_BADGES[0]!
  for (const b of RANK_BADGES) if (goi >= b.min) badge = b
  return badge
}

/** The next rank up and how many GOI points away it is, or null at the top. */
export function nextRank(goi: number): { badge: RankBadge; points: number } | null {
  const next = RANK_BADGES.find((b) => b.min > goi)
  return next ? { badge: next, points: next.min - goi } : null
}
