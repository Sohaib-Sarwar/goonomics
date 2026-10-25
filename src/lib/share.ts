import { INVITE } from './copy/lines'
import { fmtBigWords, fmtDuration, fmtInt } from './format'
import { SITE_URL } from './site'
import type { AuditResult } from './types'

export type CardStat = 'sessions' | 'swimmers' | 'time'
export type CardFormat = 'story' | 'square'

export const CARD_SIZES: Record<CardFormat, { width: number; height: number }> = {
  story: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
}

export const CARD_STATS: { id: CardStat; label: string }[] = [
  { id: 'sessions', label: 'Sessions' },
  { id: 'swimmers', label: 'Swimmers' },
  { id: 'time', label: 'Time' },
]

export function statValue(id: CardStat, r: AuditResult): { value: string; label: string } {
  switch (id) {
    case 'sessions':
      return { value: fmtInt(r.sessions), label: 'lifetime sessions, estimated' }
    case 'swimmers':
      return { value: fmtBigWords(r.output.spermCells), label: 'little swimmers. Cells, not kids.' }
    case 'time':
      return { value: fmtDuration(r.time.minutes), label: 'of modeled side quest time' }
  }
}

/** Plain text for copy and share. Ages and raw answers are never included. */
export function shareText(opts: { verdict: string; goi: number; caption: string }): string {
  return `${opts.caption}\nVerdict: ${opts.verdict}. GOI ${opts.goi}.\n${INVITE}\n${SITE_URL}`
}

export function whatsappUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
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
    imgs.map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((res) => {
            img.addEventListener('load', () => res(), { once: true })
            img.addEventListener('error', () => res(), { once: true })
          }),
    ),
  )
  await document.fonts?.ready
}

/** Renders a card node at its native size to a PNG blob, entirely in the browser. */
export async function renderCardPng(node: HTMLElement, format: CardFormat): Promise<Blob> {
  const { domToBlob } = await import('modern-screenshot')
  await waitForImages(node)
  const { width, height } = CARD_SIZES[format]
  const blob = await domToBlob(node, { scale: 1, type: 'image/png', backgroundColor: '#0C0C0F', width, height })
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
      const file = new File([png], 'goonomics-allegations.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ text, files: [file] })
        return 'shared'
      }
    }
    await navigator.share({ title: 'GOONOMICS', text, url: SITE_URL })
    return 'shared'
  } catch (e) {
    return e instanceof DOMException && e.name === 'AbortError' ? 'cancelled' : 'failed'
  }
}
