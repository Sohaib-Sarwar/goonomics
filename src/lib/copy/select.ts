import { BIOLOGY, CAPTIONS, LOADING } from './lines'
import { HEADLINES, ROASTS, type Heat } from './roasts'
import { bandFor } from './verdicts'

/**
 * Copy is chosen with a seeded RNG so the same inputs show the same jokes until the user asks for
 * new ones. The numbers never touch this file; it only decides which words to show.
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

export function pick<T>(items: readonly T[], rand: () => number): T {
  if (items.length === 0) throw new Error('Cannot pick from an empty list')
  return items[Math.floor(rand() * items.length)]!
}

export function shuffle<T>(items: readonly T[], rand: () => number): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`)
}

export interface CopyPick {
  headline: string
  roast: string
  biology: string[]
}

/** Separate seeds for roast and the rest, so "new roast" swaps only the roast. */
export function pickCopy(tier: number, heat: Heat, seed: number, roastSeed: number, vars: Record<string, string>): CopyPick {
  const band = bandFor(tier)
  const rand = mulberry32(seed)
  const bio = shuffle(BIOLOGY, rand)
  return {
    headline: pick(HEADLINES[band], rand),
    roast: fill(pick(ROASTS[heat][band], mulberry32(roastSeed)), vars),
    biology: [bio[0]!, bio[1]!],
  }
}

export function pickCaption(tier: number, seed: number): string {
  const band = bandFor(tier)
  return pick([...CAPTIONS[band], ...CAPTIONS.any], mulberry32(seed ^ 0x5bd1e995))
}

/** One opening line, a shuffled middle, and one closing line. */
export function loadingScript(seed: number, middleCount = 4): string[] {
  const rand = mulberry32(seed ^ 0x9e3779b9)
  const open = LOADING.filter((l) => l.stage === 'open')
  const middle = shuffle(
    LOADING.filter((l) => l.stage === 'middle'),
    rand,
  ).slice(0, middleCount)
  const close = LOADING.filter((l) => l.stage === 'close')
  return [pick(open, rand).text, ...middle.map((m) => m.text), pick(close, rand).text]
}
