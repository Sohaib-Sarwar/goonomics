import type { Ref } from 'react'
import { MICROCOPY } from '../lib/copy/lines'
import type { Verdict } from '../lib/copy/verdicts'
import { goiBand } from '../lib/goi'
import { QR_SRC, SITE_HOST } from '../lib/site'
import { ReactionMascot, Stamp } from './Mascot'

export interface CardData {
  verdict: Verdict
  stat: { value: string; label: string }
  roast: string
  goi: number
  achievement: string | null
  fileNo: string
}

/** Font size that keeps a line count sane for a given text length. */
function fit(text: string, steps: [number, number][], fallback: number): number {
  for (const [maxLen, size] of steps) if (text.length <= maxLen) return size
  return fallback
}

/** Clean white plate so the QR always has contrast and a quiet zone. Nothing overlaps it. */
function QrPlate({ size }: { size: number }) {
  return (
    <div className="shrink-0 rounded-[20px] bg-white" style={{ padding: Math.round(size * 0.06) }}>
      <img src={QR_SRC} width={size} height={size} alt={`QR code to ${SITE_HOST}`} className="block" style={{ width: size, height: size, imageRendering: 'pixelated' }} />
    </div>
  )
}

function Wordmark({ size }: { size: number }) {
  return (
    <div className="font-display leading-none font-black tracking-[-0.01em] text-paper uppercase" style={{ fontSize: size }}>
      G<span className="text-lime">OO</span>NOMICS
    </div>
  )
}

/** 1080 × 1920 vertical artboard for Stories and Status. Pixel units on purpose. */
export function StoryCard({ data, ref }: { data: CardData; ref?: Ref<HTMLDivElement> }) {
  const { verdict, stat, roast, goi, achievement, fileNo } = data
  return (
    <div ref={ref} className="grid-paper relative flex flex-col overflow-hidden bg-ink text-paper" style={{ width: 1080, height: 1920, padding: 84 }}>
      <div aria-hidden className="absolute -top-40 -right-40 h-[620px] w-[620px] rounded-full bg-lime/10 blur-3xl" />
      <div className="relative flex items-center justify-between">
        <Wordmark size={92} />
        <div className="text-right font-mono text-[26px] leading-tight text-muted">
          <div>Official audit</div>
          <div className="text-paper">File {fileNo}</div>
        </div>
      </div>

      <div className="relative mt-16 font-mono text-[34px] text-lime">{MICROCOPY.cardKicker}</div>
      <div
        className="relative mt-4 font-display leading-[0.86] font-black tracking-[-0.01em] uppercase"
        style={{ fontSize: fit(verdict.name, [[16, 168], [24, 140], [34, 118]], 104) }}
      >
        {verdict.name}
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center py-6">
        <div className="relative aspect-square h-full max-h-[620px]">
          <ReactionMascot reaction={verdict.reaction} className="h-full w-full" />
          <div className="absolute bottom-[6%] -right-[24%] z-10">
            <Stamp size="lg" className="!border-[7px] bg-ink/85 !px-7 !text-[60px]">
              {verdict.stamp}
            </Stamp>
          </div>
        </div>
      </div>

      <div className="relative flex items-end justify-between gap-6">
        <div className="min-w-0">
          <div className="tabular font-mono leading-none font-medium whitespace-nowrap text-lime" style={{ fontSize: fit(stat.value, [[6, 150], [9, 120], [12, 96]], 84) }}>
            {stat.value}
          </div>
          <div className="mt-3 text-[32px] leading-tight text-muted">{stat.label}</div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-full border-[3px] border-paper px-6 py-2 font-mono text-[34px] font-medium">
            GOI <span className="text-lime">{goi}</span>
          </span>
          <span className="text-[26px] text-muted">{goiBand(goi)}</span>
        </div>
      </div>
      {achievement && (
        <div className="relative mt-5 text-[28px] text-muted">
          Unlocked: <span className="font-semibold text-paper">{achievement}</span>
        </div>
      )}

      <div className="relative mt-10 border-l-[8px] border-lime pl-9 font-display leading-[1.02] font-bold" style={{ fontSize: fit(roast, [[50, 72], [80, 62]], 54) }}>
        “{roast}”
      </div>

      <div className="relative mt-12 flex items-end gap-10">
        <QrPlate size={280} />
        <div className="min-w-0 pb-2">
          <div className="font-display text-[76px] leading-none font-black uppercase">{MICROCOPY.cardCta}</div>
          <div className="mt-3 font-mono text-[42px] text-lime">{SITE_HOST}</div>
          <div className="mt-5 text-[24px] leading-snug text-faint">{MICROCOPY.cardDisclaimer}</div>
        </div>
      </div>
    </div>
  )
}

/** 1080 × 1080 square artboard for feeds and chats. Its own composition, not a crop. */
export function SquareCard({ data, ref }: { data: CardData; ref?: Ref<HTMLDivElement> }) {
  const { verdict, stat, roast, goi, fileNo } = data
  return (
    <div ref={ref} className="grid-paper relative flex overflow-hidden bg-ink text-paper" style={{ width: 1080, height: 1080, padding: 64, gap: 40 }}>
      <div aria-hidden className="absolute -bottom-48 -left-40 h-[520px] w-[520px] rounded-full bg-lime/10 blur-3xl" />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline gap-5">
          <Wordmark size={60} />
          <span className="font-mono text-[20px] text-muted">File {fileNo}</span>
        </div>
        <div className="mt-10 font-mono text-[26px] text-lime">{MICROCOPY.cardKicker}</div>
        <div
          className="mt-3 font-display leading-[0.86] font-black tracking-[-0.01em] uppercase"
          style={{ fontSize: fit(verdict.name, [[16, 112], [24, 92], [34, 78]], 70) }}
        >
          {verdict.name}
        </div>
        <div className="tabular mt-9 font-mono leading-none font-medium whitespace-nowrap text-lime" style={{ fontSize: fit(stat.value, [[6, 112], [9, 92], [12, 72]], 64) }}>
          {stat.value}
        </div>
        <div className="mt-3 text-[24px] text-muted">{stat.label}</div>
        <div className="mt-auto border-l-[6px] border-lime pl-6 font-display leading-[1.04] font-bold" style={{ fontSize: fit(roast, [[50, 44], [80, 38]], 34) }}>
          “{roast}”
        </div>
        <div className="mt-5 text-[17px] text-faint">{MICROCOPY.cardDisclaimer}</div>
      </div>

      <div className="relative flex w-[330px] shrink-0 flex-col items-center">
        <div className="relative h-[300px] w-[300px]">
          <ReactionMascot reaction={verdict.reaction} className="h-full w-full" />
          <div className="absolute bottom-[2%] -left-[8%] z-10">
            <Stamp size="md" className="bg-ink/85 !text-[34px]">
              {verdict.stamp}
            </Stamp>
          </div>
        </div>
        <span className="mt-4 rounded-full border-[3px] border-paper px-5 py-1.5 font-mono text-[28px] font-medium">
          GOI <span className="text-lime">{goi}</span>
        </span>
        <span className="mt-2 text-[22px] text-muted">{goiBand(goi)}</span>
        <div className="mt-auto flex flex-col items-center">
          <QrPlate size={210} />
          <div className="mt-3 font-mono text-[24px] text-lime">{SITE_HOST}</div>
        </div>
      </div>
    </div>
  )
}
