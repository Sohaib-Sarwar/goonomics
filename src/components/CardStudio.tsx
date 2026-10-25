import { Check, Copy, Download, Maximize2, MessageCircle, RefreshCw, Share2, Swords } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { CARD_FIELDS, CARD_SIZE, RECOMMENDED_FIELDS, type CardField } from '../lib/card'
import { EXPOSE, MICROCOPY } from '../lib/copy/lines'
import { pickCaption } from '../lib/copy/select'
import type { Verdict } from '../lib/copy/verdicts'
import { canNativeShare, copyText, downloadBlob, nativeShare, renderCardPng, shareText, whatsappUrl } from '../lib/share'
import { SITE_URL } from '../lib/site'
import type { AuditResult } from '../lib/types'
import { MasterCard } from './MasterCard'
import { FitBox, Sheet } from './ui'

interface Props {
  result: AuditResult
  verdict: Verdict
  roast: string
  achievement: string | null
  fileNo: string
  seed: number
  fields: CardField[]
  setFields: (f: CardField[]) => void
  onCompare: () => void
}

type Status = { kind: 'busy' | 'done' | 'error'; msg: string } | null

/** Preview, "What are we exposing?", export and share. Everything happens in the browser. */
export function CardStudio({ result, verdict, roast, achievement, fileNo, seed, fields, setFields, onCompare }: Props) {
  const [captionSeed, setCaptionSeed] = useState(seed)
  const [status, setStatus] = useState<Status>(null)
  const [enlarged, setEnlarged] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  const caption = useMemo(() => pickCaption(result.tier, captionSeed), [result.tier, captionSeed])
  const text = shareText({ verdict: verdict.name, goi: result.goi, caption })
  const cardProps = { result, verdict, roast, achievement, fileNo, fields }
  const allOn = CARD_FIELDS.every((f) => fields.includes(f))

  const toggle = (f: CardField) => setFields(fields.includes(f) ? fields.filter((x) => x !== f) : CARD_FIELDS.filter((x) => x === f || fields.includes(x)))

  const render = async () => {
    if (!exportRef.current) throw new Error('No card')
    return renderCardPng(exportRef.current)
  }

  const onDownload = async () => {
    setStatus({ kind: 'busy', msg: MICROCOPY.rendering })
    try {
      downloadBlob(await render(), `goonomics-${fileNo.toLowerCase()}.png`)
      setStatus({ kind: 'done', msg: MICROCOPY.downloaded })
    } catch {
      setStatus({ kind: 'error', msg: 'Could not render the image in this browser. Copy the roast instead.' })
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
  const btn = 'press inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold tiny:py-2'

  return (
    <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:grid-rows-1 md:gap-6">
      <button type="button" onClick={() => setEnlarged(true)} className="group relative min-h-0" aria-label={`${MICROCOPY.enlarge}. Card preview`}>
        <FitBox width={CARD_SIZE.width} height={CARD_SIZE.height} className="h-full w-full">
          <div className="pointer-events-none">
            <MasterCard {...cardProps} />
          </div>
        </FitBox>
        <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-ink/80 px-2 py-1 text-[0.7rem] text-muted group-hover:text-paper">
          <Maximize2 size={12} aria-hidden /> {MICROCOPY.enlarge}
        </span>
      </button>

      <div className="flex min-w-0 flex-col justify-center gap-2.5 md:gap-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <p className="font-display text-xl leading-none font-black uppercase md:text-2xl">{EXPOSE.title}</p>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => setFields([...CARD_FIELDS])} disabled={allOn} className="press rounded-lg bg-raised px-2.5 py-1 text-xs font-semibold hover:bg-line-strong disabled:opacity-50">
                {EXPOSE.all}
              </button>
              <button type="button" onClick={() => setFields([...RECOMMENDED_FIELDS])} className="press rounded-lg px-2 py-1 text-xs text-muted hover:text-paper">
                {EXPOSE.reset}
              </button>
            </div>
          </div>
          <div role="group" aria-label={EXPOSE.title} className="mt-2 grid grid-cols-3 gap-1.5">
            {CARD_FIELDS.map((f) => {
              const on = fields.includes(f)
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(f)}
                  className={`press flex min-w-0 items-center justify-center gap-1 rounded-lg border px-1.5 py-1.5 text-[0.72rem] leading-tight font-semibold sm:text-xs ${
                    on ? 'border-lime bg-lime/15 text-lime' : 'border-line-strong text-muted hover:text-paper'
                  }`}
                >
                  {on && <Check size={12} className="shrink-0" aria-hidden />}
                  <span className="min-w-0 text-balance">{EXPOSE.fields[f]}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button type="button" onClick={onDownload} disabled={busy} className={`${btn} col-span-2 bg-lime font-bold text-ink hover:bg-[#d4ff7f] disabled:opacity-60`}>
            <Download size={16} aria-hidden /> {busy ? MICROCOPY.rendering : MICROCOPY.download}
          </button>
          {canNativeShare() ? (
            <button type="button" onClick={onShare} disabled={busy} className={`${btn} border border-line-strong hover:border-paper disabled:opacity-60`}>
              <Share2 size={16} aria-hidden />
              <span className="hidden min-[380px]:inline">{MICROCOPY.shareReceipts}</span>
              <span className="min-[380px]:hidden">Share</span>
            </button>
          ) : (
            <a href={whatsappUrl(text)} target="_blank" rel="noopener noreferrer" className={`${btn} border border-line-strong hover:border-paper`}>
              <MessageCircle size={16} aria-hidden /> {MICROCOPY.whatsapp}
            </a>
          )}
          <button type="button" onClick={() => onCopy('roast')} className={`${btn} border border-line-strong hover:border-paper`}>
            <Copy size={16} aria-hidden /> <span className="text-balance">{MICROCOPY.copyRoast}</span>
          </button>
          <button type="button" onClick={onCompare} className={`${btn} col-span-2 border border-line-strong hover:border-paper`}>
            <Swords size={16} aria-hidden /> <span className="text-balance">{MICROCOPY.compareFriend}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-line bg-panel/70 px-3 py-2 flat:hidden">
          <p className="line-clamp-2 min-w-0 flex-1 text-sm leading-snug font-semibold" title={caption}>
            {caption}
          </p>
          <button type="button" onClick={() => onCopy('caption')} className="press shrink-0 rounded-lg bg-raised p-1.5 hover:bg-line-strong" aria-label={MICROCOPY.copyCaption}>
            <Copy size={15} aria-hidden />
          </button>
          <button type="button" onClick={() => setCaptionSeed((s) => s + 1)} className="press shrink-0 rounded-lg p-1.5 text-muted hover:text-paper" aria-label={MICROCOPY.newCaption}>
            <RefreshCw size={15} aria-hidden />
          </button>
          {canNativeShare() && (
            <a href={whatsappUrl(text)} target="_blank" rel="noopener noreferrer" className="press shrink-0 rounded-lg p-1.5 text-muted hover:text-paper" aria-label={`${MICROCOPY.whatsapp}: send the caption`}>
              <MessageCircle size={15} aria-hidden />
            </a>
          )}
        </div>

        <p role="status" aria-live="polite" className={`min-h-5 text-sm leading-tight ${status?.kind === 'error' ? 'text-coral' : 'text-lime'}`}>
          {status?.msg}
        </p>
      </div>

      {/* The export source: the real card at native size, off screen, so page layout never touches it. */}
      <div aria-hidden className="pointer-events-none fixed top-0 left-[-20000px]">
        <MasterCard {...cardProps} ref={exportRef} />
      </div>

      <Sheet open={enlarged} onClose={() => setEnlarged(false)} title="Card preview">
        <FitBox width={CARD_SIZE.width} height={CARD_SIZE.height} className="h-[72dvh] w-full">
          <MasterCard {...cardProps} />
        </FitBox>
      </Sheet>
    </div>
  )
}
