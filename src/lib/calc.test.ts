import { describe, expect, it } from 'vitest'
import { DAYS_PER_YEAR, SPERM_MILLIONS, VOLUME_ML } from './assumptions'
import { assertNoOverlap, buildSegments, calculateAudit, fictionalMeter, sessionsPerYear } from './calc'
import { VERDICTS, tierFor } from './copy/verdicts'
import type { AuditInput, Era } from './types'

function input(overrides: Partial<AuditInput> = {}): AuditInput {
  return {
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
    ...overrides,
  }
}

function era(id: string, fromAge: number, toAge: number, normalPerDay: number, extra: Partial<Era> = {}): Era {
  return { id, label: id, fromAge, toAge, normalPerDay, peakPerDay: normalPerDay, peakDaysPerYear: 0, offDaysPerYear: 0, ...extra }
}

describe('sessionsPerYear', () => {
  it('multiplies regular days by the normal rate', () => {
    expect(sessionsPerYear({ normalPerDay: 1, peakPerDay: 1, peakDaysPerYear: 0, offDaysPerYear: 0 }, 0)).toBeCloseTo(DAYS_PER_YEAR)
  })

  it('carves peak days out of regular days instead of adding them on top', () => {
    const s = sessionsPerYear({ normalPerDay: 1, peakPerDay: 3, peakDaysPerYear: 50, offDaysPerYear: 0 }, 0)
    expect(s).toBeCloseTo((DAYS_PER_YEAR - 50) * 1 + 50 * 3)
  })

  it('subtracts inactive days exactly once', () => {
    const s = sessionsPerYear({ normalPerDay: 2, peakPerDay: 2, peakDaysPerYear: 0, offDaysPerYear: 65 }, 0)
    expect(s).toBeCloseTo((DAYS_PER_YEAR - 65) * 2)
  })

  it('applies a reduced rate on off days when given', () => {
    const s = sessionsPerYear({ normalPerDay: 2, peakPerDay: 2, peakDaysPerYear: 0, offDaysPerYear: 100 }, 0.5)
    expect(s).toBeCloseTo((DAYS_PER_YEAR - 100) * 2 + 100 * 0.5)
  })

  it('rejects more special days than a year holds', () => {
    expect(() => sessionsPerYear({ normalPerDay: 1, peakPerDay: 2, peakDaysPerYear: 300, offDaysPerYear: 100 }, 0)).toThrow(RangeError)
  })
})

describe('calculateAudit: simple mode', () => {
  it('computes lifetime sessions over the modeled years', () => {
    const r = calculateAudit(input())
    expect(r.years).toBe(10)
    expect(r.sessions).toBeCloseTo(10 * DAYS_PER_YEAR)
    expect(r.avgPerDay).toBeCloseTo(1)
  })

  it('handles zero frequency without dividing by zero', () => {
    const r = calculateAudit(input({ normalPerDay: 0, peakPerDay: 0 }))
    expect(r.sessions).toBe(0)
    expect(r.output.totalMl).toBe(0)
    expect(r.output.spermCells).toBe(0)
    expect(r.time.minutes).toBe(0)
    expect(r.fictional.meter).toBe(0)
    expect(r.tier).toBe(0)
  })

  it('handles zero modeled years (lore started this year)', () => {
    const r = calculateAudit(input({ startAge: 28 }))
    expect(r.sessions).toBe(0)
    expect(r.avgPerDay).toBe(0)
    expect(r.time.shareOfModeledTime).toBe(0)
  })

  it('accepts fractional averages', () => {
    const r = calculateAudit(input({ normalPerDay: 0.5, peakPerDay: 0.5, startAge: 8, currentAge: 28 }))
    expect(r.sessions).toBeCloseTo(0.5 * 20 * DAYS_PER_YEAR)
  })

  it('uses a mean Gregorian year, so four years includes one leap day on average', () => {
    const r = calculateAudit(input({ startAge: 20, currentAge: 24 }))
    expect(r.modeledDays).toBeCloseTo(1460.97, 2)
    expect(Math.abs(r.sessions - 1461)).toBeLessThan(0.05)
  })
})

describe('calculateAudit: fluid and sperm estimates', () => {
  it('multiplies sessions by the median volume and total sperm number', () => {
    const r = calculateAudit(input({ normalPerDay: 0.5, peakPerDay: 0.5 }))
    expect(r.output.preset).toBe('median')
    expect(r.output.totalMl).toBeCloseTo(r.sessions * VOLUME_ML.median.value)
    expect(r.output.totalLiters).toBeCloseTo(r.output.totalMl / 1000)
    expect(r.output.spermCells).toBeCloseTo(r.sessions * SPERM_MILLIONS.median.value * 1e6)
  })

  it('never uses the 5th-centile reference limit as the default', () => {
    for (const preset of ['median', 'frequent'] as const) {
      const r = calculateAudit(input({ outputPreset: preset }))
      expect(r.output.mlPerSession).not.toBe(VOLUME_ML.referenceLimit.value)
      expect(r.output.spermMillionsPerSession).not.toBe(SPERM_MILLIONS.referenceLimit.value)
    }
  })

  it('auto picks frequent-ejaculation values at one or more per day', () => {
    const daily = calculateAudit(input({ outputPreset: 'auto', normalPerDay: 1 }))
    expect(daily.output.preset).toBe('frequent')
    expect(daily.output.autoSelected).toBe(true)
    expect(daily.output.mlPerSession).toBe(VOLUME_ML.frequent.value)
    const weekly = calculateAudit(input({ outputPreset: 'auto', normalPerDay: 0.3, peakPerDay: 0.3 }))
    expect(weekly.output.preset).toBe('median')
  })

  it('uses custom values when chosen', () => {
    const r = calculateAudit(input({ outputPreset: 'custom', customMl: 2, customSpermMillions: 100 }))
    expect(r.output.totalMl).toBeCloseTo(r.sessions * 2)
    expect(r.output.spermCells).toBeCloseTo(r.sessions * 100e6)
  })

  it('gives a range that always contains the point estimate', () => {
    for (const preset of ['median', 'frequent'] as const) {
      const r = calculateAudit(input({ outputPreset: preset }))
      expect(r.output.mlRange[0]).toBeLessThanOrEqual(r.output.totalMl)
      expect(r.output.mlRange[1]).toBeGreaterThanOrEqual(r.output.totalMl)
      expect(r.output.spermRange[0]).toBeLessThanOrEqual(r.output.spermCells)
      expect(r.output.spermRange[1]).toBeGreaterThanOrEqual(r.output.spermCells)
    }
  })

  it('stays finite for the largest allowed inputs', () => {
    const r = calculateAudit(input({ startAge: 10, currentAge: 110, normalPerDay: 20, peakPerDay: 30, peakDaysPerYear: 365, outputPreset: 'median' }))
    expect(Number.isFinite(r.output.spermCells)).toBe(true)
    expect(r.output.spermCells).toBeGreaterThan(1e14)
    expect(r.fictional.meter).toBe(100)
  })
})

describe('calculateAudit: time, calories, fictional', () => {
  it('converts minutes into hours and days', () => {
    const r = calculateAudit(input({ minutesPerSession: 12 }))
    expect(r.time.minutes).toBeCloseTo(r.sessions * 12)
    expect(r.time.hours).toBeCloseTo(r.time.minutes / 60)
    expect(r.time.days).toBeCloseTo(r.time.minutes / 1440)
  })

  it('computes activity comparisons from stated durations', () => {
    const r = calculateAudit(input())
    const pomodoro = r.time.comparisons.find((c) => c.id === 'pomodoro')!
    expect(pomodoro.count).toBeCloseTo(r.time.minutes / 25)
  })

  it('omits calories unless the illustrative toggle is on', () => {
    expect(calculateAudit(input()).calories).toBeNull()
    const r = calculateAudit(input({ caloriesEnabled: true, kcalPerMinute: 2 }))
    expect(r.calories!.kcal).toBeCloseTo(r.time.minutes * 2)
    expect(r.calories!.extraKcal).toBeCloseTo(r.time.minutes * (2 - 70 / 60))
  })

  it('never reports negative extra calories', () => {
    const r = calculateAudit(input({ caloriesEnabled: true, kcalPerMinute: 0.5 }))
    expect(r.calories!.extraKcal).toBe(0)
  })

  it('maps the fictional meter onto 0..100', () => {
    expect(fictionalMeter(0)).toBe(0)
    expect(fictionalMeter(50_000)).toBe(100)
    expect(fictionalMeter(1e9)).toBe(100)
    const mid = fictionalMeter(3000)
    expect(mid).toBeGreaterThan(50)
    expect(mid).toBeLessThan(90)
  })
})

describe('eras', () => {
  it('sums each era separately', () => {
    const r = calculateAudit(
      input({ mode: 'eras', startAge: 14, currentAge: 30, eras: [era('school', 14, 18, 1), era('uni', 18, 22, 2), era('now', 22, 30, 0.5)] }),
    )
    expect(r.segments).toHaveLength(3)
    expect(r.sessions).toBeCloseTo((4 * 1 + 4 * 2 + 8 * 0.5) * DAYS_PER_YEAR)
    expect(r.uncoveredYears).toBeCloseTo(0)
  })

  it('counts uncovered years as zero and reports them', () => {
    const r = calculateAudit(input({ mode: 'eras', startAge: 14, currentAge: 30, eras: [era('a', 14, 18, 1), era('b', 22, 30, 1)] }))
    expect(r.sessions).toBeCloseTo(12 * DAYS_PER_YEAR)
    expect(r.uncoveredYears).toBeCloseTo(4)
  })

  it('clips eras to the lore window', () => {
    const segs = buildSegments(input({ mode: 'eras', startAge: 16, currentAge: 25, eras: [era('wide', 10, 40, 1)] }))
    expect(segs[0]).toMatchObject({ fromAge: 16, toAge: 25 })
  })

  it('refuses overlapping eras so no day is counted twice', () => {
    expect(() => buildSegments(input({ mode: 'eras', startAge: 14, currentAge: 30, eras: [era('a', 14, 20, 1), era('b', 19, 30, 1)] }))).toThrow(/overlap/)
    expect(() => assertNoOverlap([{ label: 'a', fromAge: 1, toAge: 5 }, { label: 'b', fromAge: 5, toAge: 9 }])).not.toThrow()
  })

  it('applies peak and off days inside an era', () => {
    const r = calculateAudit(
      input({ mode: 'eras', startAge: 20, currentAge: 21, offPerDay: 0, eras: [era('x', 20, 21, 1, { peakPerDay: 4, peakDaysPerYear: 10, offDaysPerYear: 20 })] }),
    )
    expect(r.sessions).toBeCloseTo((DAYS_PER_YEAR - 30) * 1 + 10 * 4)
  })
})

describe('determinism and verdicts', () => {
  it('returns identical numbers for identical inputs', () => {
    expect(calculateAudit(input({ normalPerDay: 0.7 }))).toEqual(calculateAudit(input({ normalPerDay: 0.7 })))
  })

  it('maps sessions onto ascending verdict tiers', () => {
    expect(tierFor(0)).toBe(0)
    expect(tierFor(0.4)).toBe(1)
    expect(tierFor(100)).toBe(2)
    expect(tierFor(9_999)).toBe(5)
    expect(tierFor(10_000)).toBe(6)
    expect(tierFor(1e9)).toBe(VERDICTS.length - 1)
    const mins = VERDICTS.map((v) => v.minSessions)
    expect([...mins].sort((a, b) => a - b)).toEqual(mins)
  })
})
