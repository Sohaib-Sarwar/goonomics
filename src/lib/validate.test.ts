import { describe, expect, it } from 'vitest'
import { defaultForm, newEra, parseNumber, suggestEras, validateForm, type FormState } from './validate'

function form(overrides: Partial<FormState> = {}): FormState {
  return { ...defaultForm(), currentAge: '27', startAge: '15', normalPerDay: '1', ...overrides }
}

describe('parseNumber', () => {
  it('accepts integers, decimals and comma decimals', () => {
    expect(parseNumber('3')).toEqual({ ok: true, value: 3 })
    expect(parseNumber(' 0.5 ')).toEqual({ ok: true, value: 0.5 })
    expect(parseNumber('1,5')).toEqual({ ok: true, value: 1.5 })
    expect(parseNumber('.25')).toEqual({ ok: true, value: 0.25 })
  })

  it('rejects junk and blanks', () => {
    expect(parseNumber('')).toEqual({ ok: false, reason: 'missing' })
    expect(parseNumber('abc')).toEqual({ ok: false, reason: 'nan' })
    expect(parseNumber('1e9')).toEqual({ ok: false, reason: 'nan' })
    expect(parseNumber('Infinity')).toEqual({ ok: false, reason: 'nan' })
  })
})

describe('validateForm', () => {
  it('produces a typed input for a valid simple form', () => {
    const r = validateForm(form())
    expect(r.errors).toEqual({})
    expect(r.input).toMatchObject({ currentAge: 27, startAge: 15, normalPerDay: 1, peakPerDay: 1, offPerDay: 0 })
  })

  it('flags missing required values', () => {
    const r = validateForm(form({ currentAge: '', startAge: '', normalPerDay: '' }))
    expect(r.input).toBeNull()
    expect(Object.keys(r.errors).sort()).toEqual(['currentAge', 'normalPerDay', 'startAge'])
  })

  it('keeps the audit 18+', () => {
    expect(validateForm(form({ currentAge: '17' })).errors.currentAge).toMatch(/18/)
  })

  it('rejects a start age after the current age', () => {
    expect(validateForm(form({ startAge: '30' })).errors.startAge).toMatch(/after today/)
  })

  it('rejects non-integer ages and absurd values', () => {
    expect(validateForm(form({ currentAge: '24.5' })).errors.currentAge).toBeDefined()
    expect(validateForm(form({ normalPerDay: '21' })).errors.normalPerDay).toBeDefined()
    expect(validateForm(form({ normalPerDay: '-1' })).errors.normalPerDay).toBeDefined()
    expect(validateForm(form({ minutesPerSession: '999' })).errors.minutesPerSession).toBeDefined()
  })

  it('accepts zero frequency', () => {
    expect(validateForm(form({ normalPerDay: '0' })).input).not.toBeNull()
  })

  it('requires a peak rate once peak days are set, and it must not be below normal', () => {
    expect(validateForm(form({ peakDaysPerYear: '20' })).errors.peakPerDay).toBeDefined()
    expect(validateForm(form({ peakDaysPerYear: '20', peakPerDay: '0.5' })).errors.peakPerDay).toMatch(/at least as busy/)
    expect(validateForm(form({ peakDaysPerYear: '20', peakPerDay: '3' })).input?.peakPerDay).toBe(3)
  })

  it('rejects peak plus off days beyond a year', () => {
    const r = validateForm(form({ peakDaysPerYear: '200', peakPerDay: '2', offDaysPerYear: '200' }))
    expect(r.errors.offDaysPerYear).toMatch(/more than a year/)
  })

  it('keeps reduced off-day rates below the regular rate', () => {
    expect(validateForm(form({ offDaysPerYear: '30', offPerDay: '2' })).errors.offPerDay).toBeDefined()
    expect(validateForm(form({ offDaysPerYear: '30', offPerDay: '0.5' })).input?.offPerDay).toBe(0.5)
  })

  it('validates custom output assumptions only when selected', () => {
    expect(validateForm(form({ customMl: '' })).input).not.toBeNull()
    expect(validateForm(form({ outputPreset: 'custom', customMl: '' })).errors.customMl).toBeDefined()
  })

  it('validates calories only when the toggle is on', () => {
    expect(validateForm(form({ kcalPerMinute: '' })).input).not.toBeNull()
    expect(validateForm(form({ caloriesEnabled: true, kcalPerMinute: '' })).errors.kcalPerMinute).toBeDefined()
  })
})

describe('eras validation', () => {
  function eraForm(label: string, from: string, to: string, normal = '1') {
    return { ...newEra(label, from, to), normalPerDay: normal }
  }

  it('accepts contiguous eras and ignores simple-mode fields', () => {
    const r = validateForm(form({ mode: 'eras', normalPerDay: '', eras: [eraForm('A', '15', '20'), eraForm('B', '20', '27')] }))
    expect(r.errors).toEqual({})
    expect(r.input?.eras).toHaveLength(2)
  })

  it('reports overlapping eras', () => {
    const b = eraForm('B', '18', '27')
    const r = validateForm(form({ mode: 'eras', eras: [eraForm('A', '15', '20'), b] }))
    expect(r.errors[`eras.${b.id}.fromAge`]).toMatch(/Overlaps/)
  })

  it('reports eras outside the lore window and backwards eras', () => {
    const a = eraForm('A', '12', '20')
    const b = eraForm('B', '24', '22')
    const r = validateForm(form({ mode: 'eras', eras: [a, b] }))
    expect(r.errors[`eras.${a.id}.fromAge`]).toBeDefined()
    expect(r.errors[`eras.${b.id}.toAge`]).toBeDefined()
  })

  it('warns about uncovered years', () => {
    const r = validateForm(form({ mode: 'eras', eras: [eraForm('A', '15', '20')] }))
    expect(r.input).not.toBeNull()
    expect(r.warnings[0]).toMatch(/7 years/)
  })

  it('requires at least one era', () => {
    expect(validateForm(form({ mode: 'eras', eras: [] })).errors.eras).toBeDefined()
  })

  it('suggests contiguous eras covering the whole window', () => {
    const eras = suggestEras(14, 30)
    expect(eras).toHaveLength(4)
    expect(eras[0]!.fromAge).toBe('14')
    expect(eras[3]!.toAge).toBe('30')
    for (let i = 1; i < eras.length; i++) expect(eras[i]!.fromAge).toBe(eras[i - 1]!.toAge)
  })
})
