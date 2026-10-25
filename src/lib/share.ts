import { fmtBigWords, fmtDuration, fmtInt, fmtVolume } from './format'
import type { AuditResult } from './types'

export type CardStat = 'sessions' | 'swimmers' | 'volume' | 'time'

export const CARD_STATS: { id: CardStat; label: string }[] = [
  { id: 'sessions', label: 'Lifetime sessions' },
  { id: 'swimmers', label: 'Little swimmers' },
  { id: 'volume', label: 'Fluid volume' },
  { id: 'time', label: 'Time spent' },
]

export const MAX_CARD_STATS = 3

export function statValue(id: CardStat, r: AuditResult): { value: string; label: string } {
  switch (id) {
    case 'sessions':
      return { value: fmtInt(r.sessions), label: 'estimated lifetime sessions' }
    case 'swimmers':
      return { value: fmtBigWords(r.output.spermCells), label: 'little swimmers (cells, not kids)' }
    case 'volume':
      return { value: fmtVolume(r.output.totalMl), label: 'estimated fluid volume' }
    case 'time':
      return { value: fmtDuration(r.time.minutes), label: 'of modeled time' }
  }
}

/** Plain-text summary. Ages and raw inputs are never included. */
export function buildShareText(opts: { verdict: string; stats: CardStat[]; roast: string | null; result: AuditResult; prompt: string }): string {
  const lines = ['GOONOMICS: The Goon Audit', `Verdict: ${opts.verdict}`]
  for (const id of opts.stats) {
    const s = statValue(id, opts.result)
    lines.push(`${s.value} ${s.label}`)
  }
  if (opts.roast) lines.push(`“${opts.roast}”`)
  lines.push('', opts.prompt, 'Entertainment estimate from self-reported guesses. Not medical advice.')
  return lines.join('\n')
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older browsers or insecure contexts: fall back to a hidden textarea.
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}

async function waitForImages(node: HTMLElement) {
  const imgs = Array.from(node.querySelectorAll('img'))
  await Promise.all(
    imgs.map((img) => (img.complete ? Promise.resolve() : new Promise<void>((res) => img.addEventListener('load', () => res(), { once: true })).then(() => undefined))),
  )
  await document.fonts?.ready
}

/** Renders the report card node to a PNG blob entirely in the browser. */
export async function renderCardPng(node: HTMLElement): Promise<Blob> {
  const { domToBlob } = await import('modern-screenshot')
  await waitForImages(node)
  const blob = await domToBlob(node, {
    scale: 1,
    type: 'image/png',
    backgroundColor: '#0C0C0F',
    width: node.offsetWidth,
    height: node.offsetHeight,
  })
  if (!blob) throw new Error('Rendering failed')
  return blob
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export const canNativeShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function'

export async function nativeShare(text: string, png: Blob | null): Promise<'shared' | 'cancelled' | 'failed'> {
  try {
    if (png) {
      const file = new File([png], 'goonomics-report.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'GOONOMICS report', text, files: [file] })
        return 'shared'
      }
    }
    await navigator.share({ title: 'GOONOMICS report', text })
    return 'shared'
  } catch (e) {
    return e instanceof DOMException && e.name === 'AbortError' ? 'cancelled' : 'failed'
  }
}
