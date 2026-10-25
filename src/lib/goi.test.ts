import { describe, expect, it } from 'vitest'
import { ACHIEVEMENTS, unlockedAchievements } from './achievements'
import { calculateAudit } from './calc'
import { GOI_MAX, GOI_MIN, goiBand, goiScore } from './goi'
import type { AuditInput } from './types'

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
  outputPreset: 'auto',
  customMl: 3,
  customSpermMillions: 210,
  caloriesEnabled: false,
  kcalPerMinute: 2,
}

describe('GOI', () => {
  it('spans 300 to 850', () => {
    expect(goiScore({ sessions: 0, avgPerDay: 0 })).toBe(GOI_MIN)
    expect(goiScore({ sessions: 50_000, avgPerDay: 4 })).toBe(GOI_MAX)
    expect(goiScore({ sessions: 1e9, avgPerDay: 100 })).toBe(GOI_MAX)
  })

  it('rises with lifetime sessions and with intensity', () => {
    expect(goiScore({ sessions: 5000, avgPerDay: 1 })).toBeGreaterThan(goiScore({ sessions: 1000, avgPerDay: 1 }))
    expect(goiScore({ sessions: 1000, avgPerDay: 2 })).toBeGreaterThan(goiScore({ sessions: 1000, avgPerDay: 0.5 }))
  })

  it('is part of the deterministic engine output', () => {
    const r = calculateAudit(base)
    expect(r.goi).toBe(goiScore(r))
    expect(calculateAudit(base).goi).toBe(r.goi)
  })

  it('maps scores to bands', () => {
    expect(goiBand(300)).toBe('Touch grass champion')
    expect(goiBand(650)).toBe('Down bad researcher')
    expect(goiBand(850)).toBe('The spreadsheet has resigned')
  })
})

describe('achievements', () => {
  const names = (i: AuditInput) => unlockedAchievements(calculateAudit(i), i).map((a) => a.id)

  it('gives monk mode, and only monk mode, at zero', () => {
    expect(names({ ...base, normalPerDay: 0, peakPerDay: 0 })).toEqual(['monk'])
  })

  it('unlocks by documented thresholds', () => {
    // 10 years × 365.2425 × 1 = 3,652 sessions, 913 hours
    expect(names(base)).toEqual(expect.arrayContaining(['lore', 'survivor', 'grass']))
    expect(names(base)).not.toContain('boss')
    expect(names(base)).not.toContain('sidequester')
    const big = { ...base, startAge: 13, currentAge: 45, normalPerDay: 1.5, peakPerDay: 4, peakDaysPerYear: 40 }
    expect(names(big)).toEqual(expect.arrayContaining(['boss', 'sidequester', 'cinema', 'unc', 'peak']))
    expect(names({ ...base, offDaysPerYear: 120 })).toContain('lockedin')
  })

  it('documents a rule for every achievement', () => {
    for (const a of ACHIEVEMENTS) expect(a.rule.length).toBeGreaterThan(5)
  })
})
