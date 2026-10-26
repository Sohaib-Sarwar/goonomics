import { describe, expect, it } from 'vitest'
import { TARN_URL, ageToRange, tarnLink } from './tarn'

describe('link to Tarn', () => {
  it('carries nothing unless the person opted in', () => {
    expect(tarnLink(null)).toBe(`${TARN_URL}/`)
  })
  it('puts only the agreed age range and GOI in the fragment', () => {
    expect(tarnLink({ ageRange: '25-34', goi: 640 })).toBe(`${TARN_URL}/#from=goonomics&age=25-34&goi=640`)
    expect(tarnLink({ ageRange: null, goi: 702 })).toBe(`${TARN_URL}/#from=goonomics&goi=702`)
    expect(tarnLink({ ageRange: '18-24', goi: null })).not.toContain('?')
  })
  it('maps ages to ranges and refuses minors', () => {
    expect(ageToRange(17)).toBeNull()
    expect(ageToRange(18)).toBe('18-24')
    expect(ageToRange(44)).toBe('35-44')
    expect(ageToRange(80)).toBe('55+')
  })
})
