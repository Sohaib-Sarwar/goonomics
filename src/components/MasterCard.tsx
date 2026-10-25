import type { Ref } from 'react'
import { CARD_SIZE, STAT_FIELDS, cardLayout, statFor, type CardField } from '../lib/card'
import { MICROCOPY } from '../lib/copy/lines'
import type { Verdict } from '../lib/copy/verdicts'
import { rankBadge } from '../lib/badges'
import { QR_SRC } from '../lib/site'
import type { AuditResult } from '../lib/types'
import { BadgeEmblem } from './Badge'
import { ReactionArt, Stamp } from './Mascot'

export interface MasterCardProps {
  result: AuditResult
  verdict: Verdict
  roast: string
  achievement: string | null
  fileNo: string
  fields: CardField[]
  ref?: Ref<HTMLDivElement>
}

/**
 * The one share card: a fixed 1080 × 1920 artboard in pixel units, independent of the page
 * layout. Selected fields decide what renders; the reaction art absorbs leftover space, so
 * nothing ever has to clip.
 */
export function MasterCard({ result, verdict, roast, achievement, fileNo, fields, ref }: MasterCardProps) {
  const has = (f: CardField) => fields.includes(f)
  const L = cardLayout(fields, roast, verdict.name)
  const stats = STAT_FIELDS.filter(has).map((f) => ({ id: f, ...statFor(f, result) }))
  const showAchievement = has('achievement') && achievement
  const rank = rankBadge(result.goi)

  return (
    <div
      ref={ref}
      className="grid-paper relative flex flex-col overflow-hidden bg-ink text-left text-paper"
      style={{ width: CARD_SIZE.width, height: CARD_SIZE.height, padding: 76, gap: 26 }}
    >
      <div aria-hidden className="absolute -top-48 -right-40 h-[680px] w-[680px] rounded-full bg-lime/10 blur-3xl" />
      <div aria-hidden className="absolute -bottom-56 -left-40 h-[560px] w-[560px] rounded-full bg-coral/[0.07] blur-3xl" />

      <div className="relative flex shrink-0 items-center justify-between">
        <div className="font-display text-[84px] leading-none font-black tracking-[-0.01em] uppercase">
          G<span className="text-lime">OO</span>NOMICS
        </div>
        <div className="text-right font-mono text-[24px] leading-tight text-muted">
          <div>{MICROCOPY.officialAudit}</div>
          <div className="text-paper">File {fileNo}</div>
        </div>
      </div>

      <div className="relative shrink-0">
        <div className="font-mono text-[34px] text-lime">{MICROCOPY.cardKicker}</div>
        {has('verdict') && (
          <div className="mt-3 font-display leading-[0.88] font-black tracking-[-0.01em] text-balance uppercase" style={{ fontSize: L.verdictSize }}>
            {verdict.name}
          </div>
        )}
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <div className="relative aspect-square h-full" style={{ maxHeight: L.reaction }}>
          <ReactionArt reaction={verdict.reaction} className="h-full w-full" />
          <div className="absolute right-[-14%] bottom-[8%] z-10">
            <Stamp size="lg" className="!border-[7px] !px-6 !text-[58px]">
              {verdict.stamp}
            </Stamp>
          </div>
        </div>
      </div>

      {(has('goi') || has('badge')) && (
        <div className="relative flex shrink-0 items-center justify-between gap-6 border-t-2 border-line-strong pt-5">
          {has('goi') && (
            <div className="shrink-0">
              <div className="font-mono text-[26px] text-muted">GOI, the Goonomics Index</div>
              <div className="tabular font-mono leading-none font-medium text-lime" style={{ fontSize: L.goiSize }}>
                {result.goi}
              </div>
            </div>
          )}
          {has('badge') && (
            <div className={`flex min-w-0 items-center gap-5 ${has('goi') ? 'justify-end text-right' : ''}`}>
              {!has('goi') && <BadgeEmblem badge={rank} className="h-[170px] w-[170px]" />}
              <div className="min-w-0">
                <div className="font-mono text-[24px] text-muted">Rank badge</div>
                <div className="font-display text-[60px] leading-[0.9] font-black text-balance uppercase" style={{ color: rank.tone }}>
                  {rank.name}
                </div>
              </div>
              {has('goi') && <BadgeEmblem badge={rank} className="h-[170px] w-[170px]" />}
            </div>
          )}
        </div>
      )}

      {stats.length > 0 && (
        <div className="relative grid shrink-0 gap-x-10 gap-y-5" style={{ gridTemplateColumns: stats.length === 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))' }}>
          {stats.map((s) => (
            <div key={s.id} className="min-w-0">
              <div
                className="tabular font-mono leading-none font-medium whitespace-nowrap"
                // Fit the value to its column: monospace glyphs are ~0.6em wide. Never truncate.
                style={{ fontSize: Math.min(L.statSize, Math.floor((stats.length === 1 ? 928 : 444) / (s.value.length * 0.62))) }}
              >
                {s.value}
              </div>
              <div className="mt-2 text-[26px] leading-tight text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {has('roast') && (
        <div className="relative shrink-0 border-l-[8px] border-lime pl-8 font-display leading-[1.03] font-bold text-balance" style={{ fontSize: L.roastSize }}>
          “{roast}”
        </div>
      )}

      {showAchievement && (
        <div className="relative shrink-0">
          <span className="inline-block rounded-full border-[3px] border-lime bg-lime/10 px-7 py-2.5 font-display text-[40px] leading-none font-black text-lime uppercase">
            Unlocked: {achievement}
          </span>
        </div>
      )}

      <div className="relative flex shrink-0 items-center gap-9 border-t-2 border-line-strong pt-7">
        <div className="shrink-0 rounded-[22px] bg-white p-4">
          <img src={QR_SRC} width={230} height={230} alt="QR code to get your own audit" className="block" style={{ width: 230, height: 230, imageRendering: 'pixelated' }} />
        </div>
        <div className="min-w-0">
          <div className="font-display text-[62px] leading-[0.92] font-black text-balance uppercase">{MICROCOPY.cardScan}</div>
          <div className="mt-4 text-[22px] leading-snug text-faint">{MICROCOPY.cardDisclaimer}</div>
        </div>
      </div>
    </div>
  )
}
