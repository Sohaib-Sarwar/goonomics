import { describe, expect, it } from 'vitest'
import { calculateAudit } from './calc'
import { CARD_FIELDS, RECOMMENDED_FIELDS, cardLayout, statFor } from './card'
import { versusLine } from './copy/lines'
import { DEFAULT_TIMELINE, calorieLine, fictionalMeters, timelineItems } from './timeline'
import type { AuditInput } from './types'
import { OVER_LIMIT, defaultForm, validateForm, type FormState } from './validate'

const base: AuditInput = {
  currentAge: 28,
  startAge: 18,
  mode: 'simple',
  normalPerDay: 1,
  peakPerDay: 1,
  peakDaysPerYear: 0,
  offDaysPerYear: 0,
  offPerDay: 0,
  eras: [],
  minutesPerSession: 15,
  outputPreset: 'median',
  customMl: 3,
  customSpermMillions: 210,
  caloriesEnabled: false,
  kcalPerMinute: 2,
}

const form = (o: Partial<FormState> = {}): FormState => ({ ...defaultForm(), currentAge: '28', startAge: '18', normalPerDay: '1', ...o })

describe('17 sessions a day limit', () => {
  it.each([
    ['0', true],
    ['1', true],
    ['16', true],
    ['17', true],
    ['0.5', true],
    ['1,5', true],
    ['17.01', false],
    ['18', false],
    ['25', false],
  ])('daily %s accepted: %s', (v, ok) => {
    const r = validateForm(form({ normalPerDay: v }))
    expect(r.input !== null).toBe(ok)
    if (!ok) expect(r.errors.normalPerDay).toBe(OVER_LIMIT)
  })

  it('rejects negatives, blanks and junk without clamping', () => {
    expect(validateForm(form({ normalPerDay: '-1' })).errors.normalPerDay).toBeDefined()
    expect(validateForm(form({ normalPerDay: '' })).errors.normalPerDay).toBeDefined()
    expect(validateForm(form({ normalPerDay: 'lots' })).errors.normalPerDay).toBeDefined()
    // 25 is rejected, never silently turned into 17.
    expect(validateForm(form({ normalPerDay: '25' })).input).toBeNull()
  })

  it('applies the same cap to peak days and eras', () => {
    expect(validateForm(form({ peakDaysPerYear: '10', peakPerDay: '18' })).errors.peakPerDay).toBe(OVER_LIMIT)
    expect(validateForm(form({ peakDaysPerYear: '10', peakPerDay: '17' })).input).not.toBeNull()
    const f = form({ mode: 'eras' })
    f.eras = [{ id: 'e1', label: 'A', fromAge: '18', toAge: '28', normalPerDay: '20', peakPerDay: '', peakDaysPerYear: '0', offDaysPerYear: '0' }]
    expect(validateForm(f).errors['eras.e1.normalPerDay']).toBe(OVER_LIMIT)
  })

  it('keeps the largest valid input finite', () => {
    const r = calculateAudit({ ...base, startAge: 10, currentAge: 110, normalPerDay: 17, peakPerDay: 17, peakDaysPerYear: 365 })
    expect(Number.isFinite(r.output.spermCells)).toBe(true)
    expect(r.goi).toBeLessThanOrEqual(850)
  })
})

describe('alternate timeline', () => {
  const r = calculateAudit(base)

  it('derives every count from modeled minutes and stated assumptions', () => {
    const items = Object.fromEntries(timelineItems(r, DEFAULT_TIMELINE).map((i) => [i.id, i.count]))
    const m = r.time.minutes
    expect(items.books).toBeCloseTo(m / (200 / 0.8))
    expect(items.lessons).toBeCloseTo(m / 30)
    expect(items.python).toBeCloseTo(m / (20 * 30))
    expect(items.tutorials).toBeCloseTo(m / 12.5)
    expect(items.films).toBeCloseTo(m / 120)
  })

  it('follows changed assumptions', () => {
    const fast = timelineItems(r, { ...DEFAULT_TIMELINE, pagesPerMinute: 1.6 }).find((i) => i.id === 'books')!.count
    const slow = timelineItems(r, DEFAULT_TIMELINE).find((i) => i.id === 'books')!.count
    expect(fast).toBeCloseTo(slow * 2)
  })

  it('labels calories as a guess and keeps fictional meters deterministic', () => {
    expect(calorieLine(r)).toBeNull()
    const withCal = calculateAudit({ ...base, caloriesEnabled: true, kcalPerMinute: 2 })
    expect(calorieLine(withCal)).toMatch(/your guess/)
    expect(fictionalMeters(r)).toEqual(fictionalMeters(calculateAudit(base)))
  })
})

describe('master card', () => {
  const r = calculateAudit(base)

  it('defaults to a privacy conscious selection', () => {
    expect(RECOMMENDED_FIELDS).toEqual(['goi', 'verdict', 'roast', 'achievement'])
    expect(CARD_FIELDS).toHaveLength(9)
  })

  it('formats each stat from the real result', () => {
    expect(statFor('sessions', r).value).toBe('3,652')
    expect(statFor('xp', r).value).toBe(r.fictional.brainrotXP.toLocaleString('en-US'))
  })

  it('shrinks type as more fields are exposed', () => {
    const few = cardLayout(RECOMMENDED_FIELDS, 'short roast', 'The Lore Archivist')
    const all = cardLayout(CARD_FIELDS, 'short roast', 'The Lore Archivist')
    expect(all.reaction).toBeLessThan(few.reaction)
    expect(all.verdictSize).toBeLessThan(few.verdictSize)
    expect(all.statSize).toBeLessThanOrEqual(70)
  })
})

describe('who is more cooked', () => {
  it('names the right winner, and ties', () => {
    expect(versusLine(700, 500).headline).toMatch(/You are more cooked/)
    expect(versusLine(600, 700).line).toMatch(/promoted to department head/)
    expect(versusLine(500, 700).headline).toMatch(/way more cooked/)
    expect(versusLine(600, 600).headline).toBe('It is a tie.')
    expect(versusLine(610, 600).headline).toMatch(/You edge it/)
  })
})
