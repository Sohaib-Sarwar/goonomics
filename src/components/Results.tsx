import { motion, useReducedMotion } from 'motion/react'
import { Fish, Flame, Hourglass, Image as ImageIcon, Info, Pencil, RefreshCw, RotateCcw, Send, Swords, Trophy } from 'lucide-react'
import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import type { Achievement } from '../lib/achievements'
import type { CardField } from '../lib/card'
import { MICROCOPY, REALITY_CHECK, SHARE_CTAS, SWIMMER_LINES } from '../lib/copy/lines'
import { HEAT_LABELS, type Heat } from '../lib/copy/roasts'
import { mulberry32, pick, type CopyPick } from '../lib/copy/select'
import type { Verdict } from '../lib/copy/verdicts'
import { fmtBigWords, fmtDuration, fmtInt, fmtNum, fmtVolume, toScientific } from '../lib/format'
import { goiBand } from '../lib/goi'
import type { TimelineAssumptions } from '../lib/timeline'
import type { AuditResult } from '../lib/types'
import { CardStudio } from './CardStudio'
import { Bubble, ReactionArt, Stamp } from './Mascot'
import { ScoreManual } from './ScoreManual'
import { Timeline } from './Timeline'
import { Segmented } from './ui'
import { useCountUp } from './useCountUp'
import { Versus } from './Versus'

type Tab = 'damage' | 'swimmers' | 'timeline' | 'versus' | 'card'

const TABS: { id: Tab; label: string; Icon: typeof Flame }[] = [
  { id: 'damage', label: MICROCOPY.tabDamage, Icon: Flame },
  { id: 'swimmers', label: MICROCOPY.tabSwimmers, Icon: Fish },
  { id: 'timeline', label: MICROCOPY.tabTimeline, Icon: Hourglass },
  { id: 'versus', label: MICROCOPY.tabVersus, Icon: Swords },
  { id: 'card', label: MICROCOPY.tabCard, Icon: ImageIcon },
]

interface Props {
  result: AuditResult
  verdict: Verdict
  copy: CopyPick
  heat: Heat
  achievements: Achievement[]
  seed: number
  fields: CardField[]
  setFields: (f: CardField[]) => void
  timeline: TimelineAssumptions
  setTimeline: (a: TimelineAssumptions) => void
  minutes: string
  setMinutes: (m: string) => void
  onHeat: (heat: Heat) => void
  onReroll: () => void
  onEdit: () => void
  onRestart: () => void
  onReceipts: () => void
}

export function Results(props: Props) {
  const { result, verdict, seed } = props
  const [tab, setTab] = useState<Tab>('damage')
  const [manual, setManual] = useState(false)
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({})
  const fileNo = `GN-${String(seed % 100000).padStart(5, '0')}`

  const go = (t: Tab) => {
    setTab(t)
    tabRefs.current[t]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab)
    if (e.key === 'ArrowRight') (e.preventDefault(), go(TABS[(i + 1) % TABS.length]!.id))
    if (e.key === 'ArrowLeft') (e.preventDefault(), go(TABS[(i - 1 + TABS.length) % TABS.length]!.id))
  }

  return (
    <section aria-label="Your results" className="flex h-full min-h-0 flex-col">
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 pt-1 sm:px-6">
        <div
          role="tablist"
          aria-label="Result panels"
          onKeyDown={onKey}
          className="order-last -mx-4 grid shrink-0 grid-cols-5 border-t border-line bg-ink/95 px-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur sm:-mx-6 md:order-first md:mx-0 md:mb-3 md:rounded-xl md:border md:bg-panel/80 md:p-1"
        >
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[id] = el
              }}
              id={`tab-${id}`}
              role="tab"
              type="button"
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => setTab(id)}
              className={`press flex min-w-0 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[0.68rem] font-semibold md:flex-row md:justify-center md:gap-1.5 md:py-2 md:text-sm ${
                tab === id ? 'text-lime md:bg-paper md:text-ink' : 'text-muted hover:text-paper'
              }`}
            >
              <Icon size={18} aria-hidden className="shrink-0" />
              <span className="max-w-full truncate">{label}</span>
            </button>
          ))}
        </div>

        <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} className="scroll-quiet min-h-0 flex-1 pb-2 focus-visible:outline-offset-2">
          {tab === 'damage' && <DamagePanel {...props} fileNo={fileNo} onManual={() => setManual(true)} onShare={() => go('card')} />}
          {tab === 'swimmers' && <SwimmersPanel {...props} />}
          {tab === 'timeline' && <Timeline result={result} assumptions={props.timeline} setAssumptions={props.setTimeline} minutes={props.minutes} setMinutes={props.setMinutes} />}
          {tab === 'versus' && <Versus goi={result.goi} />}
          {tab === 'card' && (
            <CardStudio
              result={result}
              verdict={verdict}
              roast={props.copy.roast}
              achievement={props.achievements[0]?.name ?? null}
              fileNo={fileNo}
              seed={seed}
              fields={props.fields}
              setFields={props.setFields}
              onCompare={() => go('versus')}
            />
          )}
        </div>
      </div>
      <ScoreManual open={manual} onClose={() => setManual(false)} score={result.goi} />
    </section>
  )
}

function DamagePanel({ result, verdict, copy, heat, achievements, onHeat, onReroll, onEdit, onRestart, fileNo, onManual, onShare, seed }: Props & { fileNo: string; onManual: () => void; onShare: () => void }) {
  const reduce = useReducedMotion()
  const goi = useCountUp(result.goi, 1100, 250)
  const sessions = useCountUp(result.sessions, 1100, 250)
  const cta = useMemo(() => pick(SHARE_CTAS, mulberry32(seed)), [seed])
  const shown = achievements.slice(0, 4)

  return (
    <div className="grid h-full min-h-0 grid-cols-1 content-center gap-[clamp(0.4rem,1.6vh,1rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] md:gap-x-8 flat:md:grid-cols-1">
      <div className="min-w-0 space-y-[clamp(0.4rem,1.5vh,0.9rem)]">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 pt-1 font-mono text-xs text-lime sm:text-sm">{copy.headline}</p>
          <div className="flex shrink-0 gap-1">
            <button type="button" onClick={onEdit} className="press rounded-lg border border-line-strong p-2 hover:border-paper" aria-label={MICROCOPY.editReceipts} title={MICROCOPY.editReceipts}>
              <Pencil size={14} aria-hidden />
            </button>
            <button type="button" onClick={onRestart} className="press rounded-lg border border-line-strong p-2 hover:border-paper" aria-label={MICROCOPY.startOver} title={MICROCOPY.startOver}>
              <RotateCcw size={14} aria-hidden />
            </button>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <h1 id="verdict-title" className="min-w-0 flex-1 font-display text-[clamp(1.9rem,min(7.5vw,6.2vh),3.9rem)] leading-[0.9] font-black tracking-[-0.01em] text-balance uppercase">
            {verdict.name}
          </h1>
          <motion.div
            aria-hidden
            initial={reduce ? false : { scale: 2.6, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 520, damping: 22 }}
            className="shrink-0 pt-1 md:hidden"
          >
            <Stamp size="sm">{verdict.stamp}</Stamp>
          </motion.div>
        </div>
        <p className="text-sm text-paper/85 sm:text-base short:hidden">{verdict.blurb}</p>

        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={onManual} className="press min-w-0 rounded-xl border border-lime/40 bg-lime/10 px-2.5 py-2 text-left hover:border-lime" aria-label={`GOI ${result.goi}, ${goiBand(result.goi)}. Open the score manual`}>
            <span className="flex items-center gap-1 text-[0.7rem] text-muted">
              GOI <Info size={11} aria-hidden />
            </span>
            <span className="tabular block font-mono text-[clamp(1.6rem,5vh,2.6rem)] leading-none font-medium text-lime">{Math.round(goi)}</span>
            <span className="block text-[0.7rem] leading-tight text-muted">{goiBand(result.goi)}</span>
          </button>
          <div className="min-w-0 rounded-xl border border-line bg-panel/80 px-2.5 py-2">
            <span className="block text-[0.7rem] text-muted">{MICROCOPY.sessionsLabel}</span>
            <span
              className="tabular block font-mono leading-none font-medium whitespace-nowrap"
              style={{ fontSize: `clamp(1rem, min(${(36 / Math.max(4, fmtInt(result.sessions).length)).toFixed(2)}vw, 4.6vh), 2.4rem)` }}
              aria-label={`${fmtInt(result.sessions)} sessions`}
            >
              {fmtInt(sessions)}
            </span>
            <span className="block text-[0.7rem] text-muted">{fmtNum(result.avgPerDay, 2)} a day</span>
          </div>
          <div className="min-w-0 rounded-xl border border-line bg-panel/80 px-2.5 py-2">
            <span className="block text-[0.7rem] text-muted">{MICROCOPY.timeLabel}</span>
            <span className="tabular block font-mono text-[clamp(1rem,3vh,1.5rem)] leading-tight font-medium text-balance">{fmtDuration(result.time.minutes)}</span>
          </div>
        </div>

        <figure className="rounded-xl border-l-4 border-lime bg-ink/60 px-4 py-2.5">
          <blockquote aria-live="polite">
            <motion.p key={copy.roast} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-[clamp(1.25rem,min(5vw,3.6vh),2rem)] leading-[1.05] font-bold text-pretty">
              “{copy.roast}”
            </motion.p>
          </blockquote>
          <figcaption className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
            <button type="button" onClick={onReroll} className="press inline-flex items-center gap-1.5 rounded-lg bg-raised px-2.5 py-1.5 text-xs font-semibold hover:bg-line-strong">
              <RefreshCw size={13} aria-hidden /> {MICROCOPY.newRoast}
            </button>
            <Segmented label="Roast heat" hideLabel value={heat} onChange={onHeat} size="sm" options={(['light', 'medium', 'burnt'] as const).map((h) => ({ value: h, label: HEAT_LABELS[h] }))} />
          </figcaption>
        </figure>

        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <Trophy size={13} className="text-lime" aria-hidden /> {MICROCOPY.achievements} {achievements.length}
          </p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {shown.map((a, i) => (
              <motion.li
                key={a.id}
                initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.12, type: 'spring', stiffness: 400, damping: 18 }}
                title={a.rule}
                className="rounded-full border border-lime/60 bg-lime/10 px-2.5 py-0.5 text-xs font-semibold text-lime"
              >
                {a.name}
              </motion.li>
            ))}
            {achievements.length > shown.length && <li className="px-1 py-0.5 text-xs text-muted">+{achievements.length - shown.length} more</li>}
          </ul>
        </div>
        <p className="text-[0.7rem] text-faint tiny:hidden">
          File {fileNo}. {MICROCOPY.noDiagnosis}
        </p>
        <button
          type="button"
          onClick={onShare}
          className="press inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3 font-display text-lg leading-none font-extrabold tracking-wide text-ink uppercase shadow-[0_4px_0_#7fae2c] md:hidden"
        >
          <Send size={17} aria-hidden /> {cta}
        </button>
      </div>

      <div className="hidden min-w-0 flex-col items-center gap-3 md:flex flat:hidden">
        <Bubble>{verdict.blurb}</Bubble>
        <div className="relative aspect-square h-[clamp(9rem,36vh,17rem)] max-w-full">
          <ReactionArt reaction={verdict.reaction} className="h-full w-full" />
          <motion.div
            aria-hidden
            initial={reduce ? false : { scale: 2.6, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 520, damping: 22 }}
            className="absolute -right-4 bottom-2"
          >
            <Stamp size="md">{verdict.stamp}</Stamp>
          </motion.div>
        </div>
        <button
          type="button"
          onClick={onShare}
          className="press inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3.5 font-display text-lg leading-none font-extrabold tracking-wide text-ink uppercase shadow-[0_5px_0_#7fae2c] hover:bg-[#d4ff7f]"
        >
          <Send size={18} aria-hidden /> {cta}
        </button>
      </div>
    </div>
  )
}

function SwimmersPanel({ result, seed, onReceipts }: Props) {
  const out = result.output
  const cells = useCountUp(out.spermCells, 1000)
  const sci = toScientific(out.spermCells)
  const zero = result.sessions === 0
  const line = useMemo(() => pick(SWIMMER_LINES, mulberry32(seed ^ 0x2545f491)), [seed])

  return (
    <div className="grid h-full min-h-0 grid-cols-1 content-center items-center gap-[clamp(0.4rem,1.6vh,1rem)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-8">
      <div className="flex min-w-0 items-center gap-3 md:flex-col">
        <ReactionArt reaction="cry" className="aspect-square h-[clamp(5rem,20vh,18rem)] shrink-0" />
        <p className="font-display text-[clamp(1.4rem,min(6vw,4.4vh),2.6rem)] leading-[0.95] font-black text-balance uppercase md:text-center">{line}</p>
      </div>

      <div className="min-w-0 space-y-[clamp(0.4rem,1.6vh,1rem)]">
        <div className="grid grid-cols-2 gap-2">
          <div className="min-w-0 rounded-xl border border-line bg-panel/80 px-3 py-2">
            <p className="text-xs text-muted">{MICROCOPY.swimmerCount}</p>
            <p className="font-mono leading-none font-medium text-lime" aria-label={fmtBigWords(out.spermCells)}>
              <span className="tabular block text-[clamp(1.4rem,min(8vw,5vh),2.6rem)]">{zero ? '0' : fmtBigWords(cells).split(' ')[0]}</span>
              <span className="mt-0.5 block text-sm text-paper/80">{zero ? '' : (fmtBigWords(out.spermCells).split(' ')[1] ?? '')}</span>
            </p>
            {!zero && (
              <p className="tabular truncate font-mono text-[0.7rem] text-muted">
                ≈ {sci.mantissa} × 10<sup>{sci.exponent}</sup> cells
              </p>
            )}
          </div>
          <div className="min-w-0 rounded-xl border border-line bg-panel/80 px-3 py-2">
            <p className="text-xs text-muted">{MICROCOPY.volume}</p>
            <p
              className="tabular font-mono leading-none font-medium whitespace-nowrap"
              style={{ fontSize: `clamp(1.1rem, min(${(40 / Math.max(4, fmtVolume(out.totalMl).length)).toFixed(2)}vw, 5vh), 2.6rem)` }}
            >
              {fmtVolume(out.totalMl)}
            </p>
            <p className="truncate text-[0.7rem] text-muted">
              range {fmtVolume(out.mlRange[0])} to {fmtVolume(out.mlRange[1])}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-coral/50 bg-coral/[0.07] px-3.5 py-2.5">
          <p className="font-display text-xl leading-none font-black text-coral uppercase sm:text-2xl">Kids wasted: biology says no.</p>
          <p className="mt-1 text-sm text-pretty text-paper/90">{REALITY_CHECK}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span className="min-w-0">
            {fmtNum(out.mlPerSession, 1)} mL and {fmtInt(out.spermMillionsPerSession)} million per session
            {out.preset === 'frequent' ? ', frequent sessions values' : out.preset === 'median' ? ', WHO median' : ', your custom values'}.
          </span>
          <button type="button" onClick={onReceipts} className="press shrink-0 rounded-lg border border-line-strong px-2.5 py-1.5 text-paper hover:border-paper">
            {MICROCOPY.receipts}
          </button>
        </div>
      </div>
    </div>
  )
}
