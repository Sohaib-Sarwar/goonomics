import { describe, expect, it } from 'vitest'
import { ACHIEVEMENTS } from '../achievements'
import { ACTIVITIES } from '../assumptions'
import { GOI_BANDS } from '../goi'
import { defaultForm, validateForm } from '../validate'
import { BIOLOGY, CAPTIONS, INVITE, LOADING, LORE_BUBBLES, MICROCOPY, RECEIPT_BUBBLES, SHARE_CTAS, TIME_LEAD, TIME_LINES, compareLine } from './lines'
import { HEADLINES, HEAT_LABELS, ROASTS, type Heat } from './roasts'
import { loadingScript, pickCaption, pickCopy } from './select'
import { VERDICTS, bandFor, type Band } from './verdicts'

const HEATS: Heat[] = ['light', 'medium', 'burnt']
const BANDS: Band[] = ['zero', 'low', 'mid', 'high', 'max']
const allRoasts = HEATS.flatMap((h) => BANDS.flatMap((b) => ROASTS[h][b]))
const allHeadlines = BANDS.flatMap((b) => HEADLINES[b])
const allCaptions = Object.values(CAPTIONS).flat()

/** Every string a visitor can read, collected for the punctuation rule. */
function visibleStrings(): string[] {
  const bad = validateForm({
    ...defaultForm(),
    currentAge: '17',
    startAge: '99',
    normalPerDay: '50',
    peakPerDay: '0.1',
    peakDaysPerYear: '300',
    offDaysPerYear: '300',
    offPerDay: '40',
    minutesPerSession: '999',
    outputPreset: 'custom',
    customMl: '',
    customSpermMillions: '99999',
    caloriesEnabled: true,
    kcalPerMinute: '',
  })
  return [
    ...allRoasts,
    ...allHeadlines,
    ...LOADING.map((l) => l.text),
    ...BIOLOGY,
    ...Object.values(TIME_LINES),
    TIME_LEAD,
    ...allCaptions,
    ...SHARE_CTAS,
    INVITE,
    ...Object.values(MICROCOPY),
    ...Object.values(LORE_BUBBLES),
    ...Object.values(RECEIPT_BUBBLES),
    ...VERDICTS.flatMap((v) => [v.name, v.blurb, v.stamp]),
    ...Object.values(HEAT_LABELS),
    ...ACHIEVEMENTS.flatMap((a) => [a.name, a.rule]),
    ...ACTIVITIES.flatMap((a) => [a.label, a.basis]),
    ...GOI_BANDS.map((b) => b.label),
    ...[-200, -60, -1, 0, 1, 60, 200].map(compareLine),
    ...Object.values(bad.errors),
  ]
}

describe('copy library', () => {
  it('meets the minimum counts', () => {
    expect(allRoasts.length).toBeGreaterThanOrEqual(40)
    expect(allHeadlines.length).toBeGreaterThanOrEqual(15)
    expect(VERDICTS.length).toBeGreaterThanOrEqual(10)
    expect(LOADING.length).toBeGreaterThanOrEqual(25)
    expect(Object.keys(MICROCOPY).length).toBeGreaterThanOrEqual(20)
    expect(Object.keys(TIME_LINES).length).toBeGreaterThanOrEqual(15)
    expect(BIOLOGY.length).toBeGreaterThanOrEqual(15)
    expect(allCaptions.length + SHARE_CTAS.length).toBeGreaterThanOrEqual(10)
  })

  it('has roasts for every heat and band', () => {
    for (const h of HEATS) for (const b of BANDS) expect(ROASTS[h][b].length).toBeGreaterThanOrEqual(3)
    for (const b of BANDS) expect(HEADLINES[b].length).toBeGreaterThanOrEqual(2)
  })

  it('has no duplicate jokes', () => {
    const all = [...allRoasts, ...allHeadlines, ...LOADING.map((l) => l.text), ...BIOLOGY, ...allCaptions]
    expect(new Set(all).size).toBe(all.length)
  })

  it('uses no hyphens or dashes in visitor facing copy', () => {
    const offenders = visibleStrings().filter((s) => /[-‐‑‒–—]/.test(s))
    expect(offenders).toEqual([])
  })

  it('does not use the "67" meme anywhere', () => {
    expect(visibleStrings().filter((s) => /\b6\.?7\b|six seven/i.test(s))).toEqual([])
  })

  it('has a timeline line for every activity', () => {
    for (const a of ACTIVITIES) expect(TIME_LINES[a.id]).toBeDefined()
  })
})

describe('copy selection', () => {
  const vars = { sessions: '3,652', hours: '913', years: '10' }

  it('is deterministic for a seed', () => {
    expect(pickCopy(4, 'medium', 42, 42, vars)).toEqual(pickCopy(4, 'medium', 42, 42, vars))
  })

  it('changes only the roast when the roast seed changes', () => {
    const a = pickCopy(4, 'medium', 42, 1, vars)
    const roasts = new Set(Array.from({ length: 20 }, (_, i) => pickCopy(4, 'medium', 42, i, vars).roast))
    expect(roasts.size).toBeGreaterThan(2)
    for (let i = 0; i < 20; i++) {
      const b = pickCopy(4, 'medium', 42, i, vars)
      expect(b.headline).toBe(a.headline)
      expect(b.biology).toEqual(a.biology)
    }
  })

  it('draws roasts from the chosen heat and band, with placeholders filled', () => {
    for (const heat of HEATS) {
      for (let tier = 0; tier < VERDICTS.length; tier++) {
        for (let s = 0; s < 15; s++) {
          const { roast } = pickCopy(tier, heat, 7, s, vars)
          expect(roast).not.toMatch(/\{\w+\}/)
          const pool = ROASTS[heat][bandFor(tier)].map((t) => t.replace('{sessions}', vars.sessions).replace('{hours}', vars.hours).replace('{years}', vars.years))
          expect(pool).toContain(roast)
        }
      }
    }
  })

  it('picks captions and loading scripts deterministically', () => {
    expect(pickCaption(5, 9)).toBe(pickCaption(5, 9))
    const script = loadingScript(3)
    expect(script).toHaveLength(6)
    expect(new Set(script).size).toBe(6)
    expect(loadingScript(3)).toEqual(script)
  })
})
