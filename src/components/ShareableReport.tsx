import { Check, Copy, Download, Share2 } from 'lucide-react'
import { useEffect, useRef, useState, type Ref } from 'react'
import { MICROCOPY } from '../lib/copy/lines'
import type { Verdict } from '../lib/copy/verdicts'
import {
  CARD_STATS,
  MAX_CARD_STATS,
  buildShareText,
  canNativeShare,
  copyText,
  downloadBlob,
  nativeShare,
  renderCardPng,
  statValue,
  type CardStat,
} from '../lib/share'
import type { AuditResult } from '../lib/types'
import { Mascot } from './Mascot'
import { Wordmark } from './Wordmark'

const CARD_W = 1080
const CARD_H = 1350

interface Props {
  result: AuditResult
  verdict: Verdict
  roast: string
  sharePrompt: string
  fileNo: string
}

/** The shareable report card. Rendered to PNG in the browser; nothing is uploaded. */
export function ShareableReport({ result, verdict, roast, sharePrompt, fileNo }: Props) {
  const [stats, setStats] = useState<CardStat[]>(['sessions', 'swimmers'])
  const [includeRoast, setIncludeRoast] = useState(true)
  const [status, setStatus] = useState<{ action: 'copy' | 'download' | 'share'; state: 'busy' | 'done' | 'error'; msg: string } | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.4)

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => entry && setScale(entry.contentRect.width / CARD_W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const toggle = (id: CardStat) =>
    setStats((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : cur.length >= MAX_CARD_STATS ? cur : CARD_STATS.map((c) => c.id).filter((c) => c === id || cur.includes(c))))

  const text = () => buildShareText({ verdict: verdict.name, stats, roast: includeRoast ? roast : null, result, prompt: sharePrompt })

  const onCopy = async () => {
    const ok = await copyText(text())
    setStatus({ action: 'copy', state: ok ? 'done' : 'error', msg: ok ? 'Results copied to your clipboard.' : 'Copy failed. Your browser blocked clipboard access.' })
  }

  const onDownload = async () => {
    if (!cardRef.current) return
    setStatus({ action: 'download', state: 'busy', msg: 'Rendering your report…' })
    try {
      const blob = await renderCardPng(cardRef.current)
      downloadBlob(blob, `goonomics-report-${fileNo.toLowerCase()}.png`)
      setStatus({ action: 'download', state: 'done', msg: 'Report saved as PNG.' })
    } catch {
      setStatus({ action: 'download', state: 'error', msg: 'Could not render the PNG in this browser. Copy the text instead.' })
    }
  }

  const onShare = async () => {
    setStatus({ action: 'share', state: 'busy', msg: 'Preparing your report…' })
    let png: Blob | null = null
    try {
      if (cardRef.current) png = await renderCardPng(cardRef.current)
    } catch {
      png = null
    }
    const outcome = await nativeShare(text(), png)
    setStatus(
      outcome === 'shared'
        ? { action: 'share', state: 'done', msg: 'Shared.' }
        : outcome === 'cancelled'
          ? null
          : { action: 'share', state: 'error', msg: 'Sharing failed. Try downloading the PNG instead.' },
    )
  }

  const busy = status?.state === 'busy'

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <div ref={frameRef} className="w-full overflow-hidden border border-line" style={{ height: CARD_H * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: CARD_W, height: CARD_H }}>
            <ReportCard
              ref={cardRef}
              verdict={verdict}
              fileNo={fileNo}
              stats={stats.map((id) => statValue(id, result))}
              roast={includeRoast ? roast : null}
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-faint">Preview at {Math.round(scale * 100)}%. Downloads at 1080 × 1350.</p>
      </div>

      <div>
        <fieldset>
          <legend className="font-medium">What goes on the card</legend>
          <p className="mt-1 text-sm text-muted">Up to {MAX_CARD_STATS} stats. Your age and answers are never included.</p>
          <div className="mt-3 space-y-2">
            {CARD_STATS.map((s) => {
              const checked = stats.includes(s.id)
              const disabled = !checked && stats.length >= MAX_CARD_STATS
              return (
                <label key={s.id} className={`flex items-center gap-3 text-sm ${disabled ? 'opacity-40' : 'cursor-pointer'}`}>
                  <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggle(s.id)} className="h-4 w-4 accent-lime" />
                  {s.label}
                </label>
              )
            })}
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" checked={includeRoast} onChange={(e) => setIncludeRoast(e.target.checked)} className="h-4 w-4 accent-lime" />
              The roast
            </label>
          </div>
        </fieldset>

        <div className="mt-6 grid grid-cols-1 gap-2">
          <button type="button" onClick={onDownload} disabled={busy} className="inline-flex items-center justify-center gap-2 bg-lime px-4 py-3 font-semibold text-ink hover:bg-[#d4ff7f] disabled:opacity-60">
            <Download size={18} aria-hidden />
            {status?.action === 'download' && status.state === 'busy' ? MICROCOPY.downloading : MICROCOPY.download}
          </button>
          <button type="button" onClick={onCopy} className="inline-flex items-center justify-center gap-2 border border-line-strong px-4 py-3 hover:border-paper">
            {status?.action === 'copy' && status.state === 'done' ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}
            {status?.action === 'copy' && status.state === 'done' ? MICROCOPY.copied : MICROCOPY.copy}
          </button>
          {canNativeShare() && (
            <button type="button" onClick={onShare} disabled={busy} className="inline-flex items-center justify-center gap-2 border border-line-strong px-4 py-3 hover:border-paper disabled:opacity-60">
              <Share2 size={18} aria-hidden /> {MICROCOPY.share}
            </button>
          )}
        </div>
        <p role="status" aria-live="polite" className={`mt-3 min-h-5 text-sm ${status?.state === 'error' ? 'text-coral' : 'text-muted'}`}>
          {status?.msg}
        </p>
        <p className="mt-4 text-xs leading-relaxed text-faint">
          The card and text are made in your browser. We never see them, and there is no share link, because a link would have to contain your numbers.
        </p>
      </div>
    </div>
  )
}

interface CardProps {
  verdict: Verdict
  fileNo: string
  stats: { value: string; label: string }[]
  roast: string | null
  ref?: Ref<HTMLDivElement>
}

/** Shrinks long values ("472 billion", "23 days, 9 h") so each stays on one line. */
function statSize(value: string, columns: number): number {
  const width = (936 - (columns - 1) * 24) / columns
  return Math.min(columns > 2 ? 58 : 76, Math.floor(width / (value.length * 0.6)))
}

/** Fixed 1080 × 1350 artboard (4:5, feed-friendly). Pixel units on purpose. */
function ReportCard({ verdict, fileNo, stats, roast, ref }: CardProps) {
  const filed = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  return (
    <div ref={ref} className="grid-paper relative flex flex-col bg-ink text-paper" style={{ width: CARD_W, height: CARD_H, padding: 72 }}>
      <div className="absolute top-0 left-[72px] h-[14px] w-[220px] bg-manila/85" />
      <div className="flex items-start justify-between border-b-2 border-line-strong pb-8">
        <div className="origin-top-left scale-[2.1]">
          <Wordmark size="md" />
        </div>
        <div className="text-right font-mono text-[22px] leading-snug text-muted">
          <div>Official audit report</div>
          <div className="text-paper">File {fileNo}</div>
          <div>Filed {filed}</div>
        </div>
      </div>

      <div className="relative mt-14 flex items-start gap-8">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[24px] text-lime">Verdict</div>
          <div
            className="mt-3 font-display leading-[0.86] font-black tracking-[-0.01em] uppercase"
            style={{ fontSize: verdict.name.length > 32 ? 84 : verdict.name.length > 22 ? 96 : 112 }}
          >
            {verdict.name}
          </div>
        </div>
        <Mascot className="h-[300px] w-[300px] shrink-0" mood={verdict.mood} decorative eager />
        <div className="absolute -top-6 right-[250px] -rotate-9 border-[5px] border-coral px-5 py-1.5 font-display text-[40px] font-black tracking-[0.12em] text-coral uppercase">
          {verdict.stamp}
        </div>
      </div>

      {stats.length > 0 && (
        <div className="mt-14 grid gap-6 border-t-2 border-line-strong pt-10" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div className="tabular font-mono leading-none font-medium whitespace-nowrap text-lime" style={{ fontSize: statSize(s.value, stats.length) }}>
                {s.value}
              </div>
              <div className="mt-3 text-[26px] leading-tight text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {roast && <div className="mt-12 border-l-[6px] border-lime pl-8 font-display text-[56px] leading-[1.02] font-bold">“{roast}”</div>}

      <div className="mt-auto flex items-end justify-between gap-10 border-t-2 border-line-strong pt-8 text-[22px] text-muted">
        <span className="max-w-[560px] leading-snug">Entertainment estimate from self-reported guesses. Cells are not kids. Not medical advice.</span>
        <span className="text-right font-mono text-paper">Run your own audit at GOONOMICS</span>
      </div>
    </div>
  )
}
