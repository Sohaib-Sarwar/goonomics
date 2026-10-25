import { Copy, Download, MessageCircle, RefreshCw, Share2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MICROCOPY } from '../lib/copy/lines'
import { pickCaption } from '../lib/copy/select'
import {
  CARD_SIZES,
  CARD_STATS,
  canNativeShare,
  copyText,
  downloadBlob,
  nativeShare,
  renderCardPng,
  shareText,
  statValue,
  whatsappUrl,
  type CardFormat,
  type CardStat,
} from '../lib/share'
import { SITE_URL } from '../lib/site'
import type { AuditResult } from '../lib/types'
import type { Verdict } from '../lib/copy/verdicts'
import { SquareCard, StoryCard, type CardData } from './ShareCards'
import { Segmented } from './ui'

interface Props {
  result: AuditResult
  verdict: Verdict
  roast: string
  achievement: string | null
  fileNo: string
  seed: number
}

type Status = { kind: 'busy' | 'done' | 'error'; msg: string } | null

/** Preview, export and share. Everything is generated in the browser; nothing is uploaded. */
export function ShareStudio({ result, verdict, roast, achievement, fileNo, seed }: Props) {
  const [format, setFormat] = useState<CardFormat>('story')
  const [stat, setStat] = useState<CardStat>('sessions')
  const [captionSeed, setCaptionSeed] = useState(seed)
  const [status, setStatus] = useState<Status>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [frameW, setFrameW] = useState(320)

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => entry && setFrameW(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const size = CARD_SIZES[format]
  // Fit the preview inside both the column width and a share of the viewport height.
  const maxH = typeof window === 'undefined' ? 600 : Math.max(320, window.innerHeight * 0.62)
  const scale = Math.min(frameW / size.width, maxH / size.height)

  const caption = useMemo(() => pickCaption(result.tier, captionSeed), [result.tier, captionSeed])
  const data: CardData = { verdict, stat: statValue(stat, result), roast, goi: result.goi, achievement, fileNo }
  const text = shareText({ verdict: verdict.name, goi: result.goi, caption })

  const render = async () => {
    if (!cardRef.current) throw new Error('No card')
    return renderCardPng(cardRef.current, format)
  }

  const onDownload = async () => {
    setStatus({ kind: 'busy', msg: MICROCOPY.rendering })
    try {
      downloadBlob(await render(), `goonomics-${format}-${fileNo.toLowerCase()}.png`)
      setStatus({ kind: 'done', msg: MICROCOPY.downloaded })
    } catch {
      setStatus({ kind: 'error', msg: 'Could not render the image in this browser. Copy the caption instead.' })
    }
  }

  const onShare = async () => {
    setStatus({ kind: 'busy', msg: MICROCOPY.rendering })
    let png: Blob | null = null
    try {
      png = await render()
    } catch {
      png = null
    }
    const outcome = await nativeShare(text, png)
    setStatus(outcome === 'shared' ? { kind: 'done', msg: MICROCOPY.shared } : outcome === 'cancelled' ? null : { kind: 'error', msg: MICROCOPY.shareFailed })
  }

  const onCopy = async (what: 'roast' | 'caption') => {
    const ok = await copyText(what === 'roast' ? `“${roast}”\n${SITE_URL}` : text)
    setStatus(ok ? { kind: 'done', msg: what === 'roast' ? MICROCOPY.copiedRoast : MICROCOPY.copiedCaption } : { kind: 'error', msg: 'Copy failed. Your browser blocked the clipboard.' })
  }

  const busy = status?.kind === 'busy'

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
      <div ref={frameRef} className="mx-auto w-full max-w-[26rem] lg:w-[min(26rem,40vw)]">
        <div className="mx-auto overflow-hidden rounded-2xl border border-line shadow-[0_20px_60px_rgb(0_0_0/0.5)]" style={{ width: size.width * scale, height: size.height * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: size.width, height: size.height }}>
            {format === 'story' ? <StoryCard ref={cardRef} data={data} /> : <SquareCard ref={cardRef} data={data} />}
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-faint">
          Preview. Exports at {size.width} × {size.height}.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Segmented
          label="Format"
          value={format}
          onChange={setFormat}
          options={[
            { value: 'story', label: MICROCOPY.storyMode },
            { value: 'square', label: MICROCOPY.squareMode },
          ]}
        />
        <Segmented label={MICROCOPY.cardStat} hint={MICROCOPY.cardPrivacy} value={stat} onChange={setStat} options={CARD_STATS.map((s) => ({ value: s.id, label: s.label }))} size="sm" />

        <div id="share-actions" className="grid grid-cols-1 gap-2 scroll-mt-24 sm:grid-cols-2">
          <button type="button" onClick={onDownload} disabled={busy} className="press inline-flex items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3 font-bold text-ink hover:bg-[#d4ff7f] disabled:opacity-60">
            <Download size={18} aria-hidden /> {busy ? MICROCOPY.rendering : MICROCOPY.download}
          </button>
          {canNativeShare() && (
            <button type="button" onClick={onShare} disabled={busy} className="press inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong px-4 py-3 font-semibold hover:border-paper disabled:opacity-60">
              <Share2 size={18} aria-hidden /> {MICROCOPY.shareLore}
            </button>
          )}
          <a
            href={whatsappUrl(text)}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong px-4 py-3 font-semibold hover:border-paper"
          >
            <MessageCircle size={18} aria-hidden /> {MICROCOPY.whatsapp}
          </a>
          <button type="button" onClick={() => onCopy('roast')} className="press inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong px-4 py-3 font-semibold hover:border-paper">
            <Copy size={18} aria-hidden /> {MICROCOPY.copyRoast}
          </button>
        </div>

        <div className="rounded-xl border border-line bg-panel/70 p-4">
          <p className="text-sm text-muted">Caption</p>
          <p className="mt-1 font-semibold">{caption}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => onCopy('caption')} className="press inline-flex items-center gap-1.5 rounded-lg bg-raised px-3 py-1.5 text-sm hover:bg-line-strong">
              <Copy size={14} aria-hidden /> {MICROCOPY.copyCaption}
            </button>
            <button type="button" onClick={() => setCaptionSeed((s) => s + 1)} className="press inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted hover:text-paper">
              <RefreshCw size={14} aria-hidden /> {MICROCOPY.newCaption}
            </button>
          </div>
        </div>

        <p role="status" aria-live="polite" className={`min-h-5 text-sm ${status?.kind === 'error' ? 'text-coral' : 'text-lime'}`}>
          {status?.msg}
        </p>
        <p className="text-xs text-faint">
          The image is made on your device. Instagram does not allow websites to post for you, so save it and add it to your Story. On phones, Share opens your apps directly.
        </p>
      </div>
    </div>
  )
}
