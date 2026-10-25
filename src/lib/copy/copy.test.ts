import { describe, expect, it } from 'vitest'
import { BIOLOGY, LOADING, MICROCOPY, SHARE_PROMPTS, TIME_LINES } from './lines'
import { HEADLINES, ROASTS } from './roasts'
import { loadingScript, pickCopy } from './select'
import { VERDICTS, bandFor, type Band } from './verdicts'
import { ACTIVITIES } from '../assumptions'

describe('copy library meets the brief', () => {
  it('has the required minimum counts', () => {
    expect(ROASTS.length).toBeGreaterThanOrEqual(40)
    expect(HEADLINES.length).toBeGreaterThanOrEqual(15)
    expect(VERDICTS.length).toBeGreaterThanOrEqual(10)
    expect(LOADING.length).toBeGreaterThanOrEqual(25)
    expect(Object.keys(MICROCOPY).length).toBeGreaterThanOrEqual(20)
    expect(Object.keys(TIME_LINES).length).toBeGreaterThanOrEqual(15)
    expect(BIOLOGY.length).toBeGreaterThanOrEqual(15)
    expect(SHARE_PROMPTS.length).toBeGreaterThanOrEqual(10)
  })

  it('has no duplicate lines', () => {
    const all = [...ROASTS.map((r) => r.text), ...HEADLINES.map((h) => h.text), ...LOADING.map((l) => l.text), ...BIOLOGY, ...SHARE_PROMPTS]
    expect(new Set(all).size).toBe(all.length)
  })

  it('covers every band with roasts and headlines', () => {
    const bands: Band[] = ['zero', 'low', 'mid', 'high', 'max']
    for (const band of bands) {
      expect(ROASTS.some((r) => r.bands === 'any' || r.bands.includes(band))).toBe(true)
      expect(HEADLINES.some((h) => h.bands === 'any' || h.bands.includes(band))).toBe(true)
    }
  })

  it('has a time line for every activity', () => {
    for (const a of ACTIVITIES) expect(TIME_LINES[a.id]).toBeDefined()
  })
})

describe('copy selection', () => {
  const vars = { sessions: '3,652', hours: '913', years: '10', verdict: 'The Lore Archivist' }

  it('is deterministic for a seed and varies across seeds', () => {
    expect(pickCopy(3, 42, vars)).toEqual(pickCopy(3, 42, vars))
    const roasts = new Set(Array.from({ length: 30 }, (_, i) => pickCopy(4, i, vars).roast))
    expect(roasts.size).toBeGreaterThan(3)
  })

  it('fills placeholders and only uses roasts for the right band', () => {
    for (let tier = 0; tier < VERDICTS.length; tier++) {
      for (let seed = 0; seed < 40; seed++) {
        const c = pickCopy(tier, seed, vars)
        expect(c.roast).not.toMatch(/\{\w+\}/)
        expect(c.sharePrompt).not.toMatch(/\{\w+\}/)
        const roast = ROASTS.find((r) => r.text.replace(/\{\w+\}/g, '') === c.roast.replace(/3,652|913|10/g, '') || r.text === c.roast)
        if (roast && roast.bands !== 'any') expect(roast.bands).toContain(bandFor(tier))
      }
    }
  })

  it('builds a loading script that opens, shuffles and closes', () => {
    const script = loadingScript(7)
    expect(script).toHaveLength(8)
    expect(new Set(script).size).toBe(8)
    expect(script.at(-1)).toMatch(/contact absolutely nobody/)
  })
})
