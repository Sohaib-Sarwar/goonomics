import { describe, expect, it } from 'vitest'
import { fmtBigWords, fmtCount, fmtDuration, fmtInt, fmtPercent, fmtVolume, toScientific } from './format'

describe('format', () => {
  it('groups integers', () => {
    expect(fmtInt(3652.425)).toBe('3,652')
    expect(fmtInt(0)).toBe('0')
  })

  it('words very large numbers', () => {
    expect(fmtBigWords(999_999)).toBe('999,999')
    expect(fmtBigWords(2_310_000_000_000)).toBe('2.31 trillion')
    expect(fmtBigWords(45_600_000_000)).toBe('45.6 billion')
    expect(fmtBigWords(767_000_000_000_000)).toBe('767 trillion')
    expect(fmtBigWords(3.2e18)).toBe('3.2 quintillion')
  })

  it('splits scientific notation without rounding mantissa to 10', () => {
    expect(toScientific(2.31e12)).toEqual({ mantissa: '2.31', exponent: 12 })
    expect(toScientific(9.999e11)).toEqual({ mantissa: '1.00', exponent: 12 })
    expect(toScientific(0)).toEqual({ mantissa: '0', exponent: 0 })
  })

  it('switches volume units at one litre', () => {
    expect(fmtVolume(5.4)).toBe('5.4 mL')
    expect(fmtVolume(640)).toBe('640 mL')
    expect(fmtVolume(10_957.3)).toBe('11 L')
    expect(fmtVolume(1_500)).toBe('1.5 L')
    expect(fmtVolume(250_000)).toBe('250 L')
  })

  it('formats durations', () => {
    expect(fmtDuration(45)).toBe('45 min')
    expect(fmtDuration(125)).toBe('2 h 5 min')
    expect(fmtDuration(120)).toBe('2 h')
    expect(fmtDuration(1440 * 3 + 60 * 4 + 12)).toBe('3 days, 4 h')
    expect(fmtDuration(1440)).toBe('1 day')
  })

  it('formats counts and percents', () => {
    expect(fmtCount(0.04)).toBe('<0.1')
    expect(fmtCount(2.46)).toBe('2.5')
    expect(fmtCount(1234.4)).toBe('1,234')
    expect(fmtPercent(0.0123)).toBe('1.2%')
    expect(fmtPercent(0.00001)).toBe('<0.01%')
  })
})
