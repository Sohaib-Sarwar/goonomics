import { BIOLOGY, LOADING, SHARE_PROMPTS } from './lines'
import { HEADLINES, ROASTS } from './roasts'
import { bandFor, type Band } from './verdicts'

/**
 * Copy is chosen with a seeded RNG so the same inputs show the same jokes (until the user asks
 * for a new roast). The numbers never touch this file; it only decides which words to show.
 */
export function hashString(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(items: readonly T[], rand: () => number): T {
  if (items.length === 0) throw new Error('Cannot pick from an empty list')
  return items[Math.floor(rand() * items.length)]!
}

function shuffle<T>(items: readonly T[], rand: () => number): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

const fits = (bands: Band[] | 'any', band: Band) => bands === 'any' || bands.includes(band)

export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`)
}

export interface CopyPick {
  headline: string
  roast: string
  biology: string[]
  sharePrompt: string
}

export function pickCopy(tier: number, seed: number, vars: Record<string, string>): CopyPick {
  const band = bandFor(tier)
  const rand = mulberry32(seed)
  const roasts = ROASTS.filter((r) => fits(r.bands, band))
  const headlines = HEADLINES.filter((h) => fits(h.bands, band))
  const bio = shuffle(BIOLOGY, rand)
  return {
    headline: pick(headlines, rand).text,
    roast: fill(pick(roasts, rand).text, vars),
    biology: [bio[0]!, bio[1]!],
    sharePrompt: fill(pick(SHARE_PROMPTS, rand), vars),
  }
}

/** One opening line, a shuffled middle, and one closing line. */
export function loadingScript(seed: number, middleCount = 6): string[] {
  const rand = mulberry32(seed ^ 0x9e3779b9)
  const open = LOADING.filter((l) => l.stage === 'open')
  const middle = shuffle(
    LOADING.filter((l) => l.stage === 'middle'),
    rand,
  ).slice(0, middleCount)
  const close = LOADING.filter((l) => l.stage === 'close')
  return [pick(open, rand).text, ...middle.map((m) => m.text), close[close.length - 1]!.text]
}
