/**
 * Tarn, the calm habit companion, is a separate app. GOONOMICS only links to it.
 * It is deployed at https://tarn-rehab.vercel.app; VITE_TARN_URL can override that at build time.
 */
export const TARN_URL = (import.meta.env.VITE_TARN_URL ?? 'https://tarn-rehab.vercel.app').replace(/\/$/, '')

export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55+'

export function ageToRange(age: number): AgeRange | null {
  if (!Number.isFinite(age) || age < 18) return null
  if (age < 25) return '18-24'
  if (age < 35) return '25-34'
  if (age < 45) return '35-44'
  if (age < 55) return '45-54'
  return '55+'
}

/**
 * The link into Tarn. What the person agreed to share goes in the URL fragment, which browsers never
 * send to a server; Tarn reads it once and removes it. Nothing else from the audit is ever included.
 */
export function tarnLink(share: { ageRange: AgeRange | null; goi: number | null } | null): string {
  if (!share) return `${TARN_URL}/`
  const params = new URLSearchParams({ from: 'goonomics' })
  if (share.ageRange) params.set('age', share.ageRange)
  if (share.goi !== null) params.set('goi', String(share.goi))
  return `${TARN_URL}/#${params.toString()}`
}
