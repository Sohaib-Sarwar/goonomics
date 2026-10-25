import { describe, expect, it } from 'vitest'
import { ACHIEVEMENTS } from '../achievements'
import { ACTIVITIES } from '../assumptions'
import { DEFAULT_TIMELINE, timelineItems } from '../timeline'
import { ALL_LIVE_LINES, liveComment } from './live'
import { GOI_BANDS } from '../goi'
import { defaultForm, validateForm } from '../validate'
import { BIOLOGY, CAPTIONS, EXPOSE, INVITE, LANDING, LOADING, MICROCOPY, REALITY_CHECK, SCORE_MANUAL, SHARE_CTAS, SWIMMER_LINES, VERSUS, versusLine } from './lines'
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
    ...SWIMMER_LINES,
    REALITY_CHECK,
    ...ALL_LIVE_LINES,
    LANDING.title,
    LANDING.sub,
    LANDING.cta,
    LANDING.how,
    LANDING.stepsTitle,
    LANDING.afterSteps,
    LANDING.bubble,
    ...LANDING.steps.flatMap((x) => [x.title, x.body]),
    ...Object.values(VERSUS),
    ...Object.values(SCORE_MANUAL),
    EXPOSE.title,
    EXPOSE.all,
    EXPOSE.reset,
    ...Object.values(EXPOSE.fields),
    ...timelineItems({ time: { minutes: 1000, hours: 16, days: 1, shareOfModeledTime: 0, comparisons: [] } }, DEFAULT_TIMELINE).flatMap((t) => [t.label, t.basis]),
    ...allCaptions,
    ...SHARE_CTAS,
    INVITE,
    ...Object.values(MICROCOPY),
    ...VERDICTS.flatMap((v) => [v.name, v.blurb, v.stamp]),
    ...Object.values(HEAT_LABELS),
    ...ACHIEVEMENTS.flatMap((a) => [a.name, a.rule]),
    ...ACTIVITIES.flatMap((a) => [a.label, a.basis]),
    ...GOI_BANDS.flatMap((b) => [b.label, b.blurb]),
    ...[-200, -60, -1, 0, 1, 60, 200].flatMap((d) => Object.values(versusLine(500 + d, 500))),
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
    expect(SWIMMER_LINES.length).toBeGreaterThanOrEqual(5)
    expect(ALL_LIVE_LINES.length).toBeGreaterThanOrEqual(40)
    expect(BIOLOGY.length).toBeGreaterThanOrEqual(15)
    expect(allCaptions.length + SHARE_CTAS.length).toBeGreaterThanOrEqual(10)
  })

  it('has roasts for every heat and band', () => {
    for (const h of HEATS) for (const b of BANDS) expect(ROASTS[h][b].length).toBeGreaterThanOrEqual(3)
    for (const b of BANDS) expect(HEADLINES[b].length).toBeGreaterThanOrEqual(2)
  })

  it('has no duplicate jokes', () => {
    const all = [...allRoasts, ...allHeadlines, ...LOADING.map((l) => l.text), ...BIOLOGY, ...allCaptions, ...SWIMMER_LINES]
    expect(new Set(all).size).toBe(all.length)
  })

  it('uses no hyphens or dashes in visitor facing copy', () => {
    const offenders = visibleStrings().filter((s) => /[-‐‑‒–—]/.test(s))
    expect(offenders).toEqual([])
  })

  it('does not use the "67" meme anywhere', () => {
    expect(visibleStrings().filter((s) => /\b6\.?7\b|six seven/i.test(s))).toEqual([])
  })

  it('keeps the required meme lines', () => {
    expect(SWIMMER_LINES).toContain('The imaginary daycare is in shambles.')
    expect(LANDING.title).toBe('Your lore. Under investigation.')
    expect(ACTIVITIES.length).toBeGreaterThan(0)
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

describe('live commentary', () => {
  it('reacts to every field and changes with the value', () => {
    expect(liveComment('normalPerDay', '')).toMatch(/Slide it/)
    expect(liveComment('normalPerDay', '0')).toMatch(/Zero/)
    expect(liveComment('normalPerDay', '0.1')).not.toBe(liveComment('normalPerDay', '3'))
    expect(liveComment('normalPerDay', '18')).toBe('HOW ARE YOU EVEN ALIVE? 💀 Max is 17.')
    expect(liveComment('peakPerDay', '25')).toMatch(/Max is 17/)
    expect(liveComment('startAge', '14', { currentAge: '30' })).toMatch(/16 years/)
    expect(liveComment('startAge', '40', { currentAge: '30' })).toMatch(/Time travel/)
    expect(liveComment('currentAge', '16')).toMatch(/birthday arc|council said/)
    expect(liveComment('heat', '', { heat: 'burnt' })).toMatch(/Burnt/)
    expect(liveComment('offDaysPerYear', '200')).toMatch(/200|monk/i)
    expect(liveComment('minutes', '30')).toMatch(/episode/)
  })

  it('never leaves a placeholder unfilled', () => {
    for (const field of ['normalPerDay', 'peakDaysPerYear', 'peakPerDay', 'offDaysPerYear'] as const)
      for (const v of ['0', '0.2', '1', '1.5', '3', '8', '12', '16', '40', '100', '300']) expect(liveComment(field, v)).not.toMatch(/{n}/)
  })
})
