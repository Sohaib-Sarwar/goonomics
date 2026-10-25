import { motion, useReducedMotion } from 'motion/react'
import { Pencil, RefreshCw, RotateCcw, Send, Trophy } from 'lucide-react'
import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { ACTIVITIES, CALORIES, FICTIONAL, VOLUME_ML } from '../lib/assumptions'
import type { Achievement } from '../lib/achievements'
import { MICROCOPY, SHARE_CTAS, TIME_LEAD, TIME_LINES, compareLine } from '../lib/copy/lines'
import { HEAT_LABELS, type Heat } from '../lib/copy/roasts'
import { fill, mulberry32, pick, shuffle, type CopyPick } from '../lib/copy/select'
import type { Verdict } from '../lib/copy/verdicts'
import { fmtBigWords, fmtCount, fmtDuration, fmtInt, fmtNum, fmtPercent, fmtVolume, toScientific } from '../lib/format'
import { GOI_MAX, GOI_MIN, goiBand } from '../lib/goi'
import { parseNumber } from '../lib/validate'
import type { AuditResult } from '../lib/types'
import { ReactionMascot, Stamp } from './Mascot'
import { ShareStudio } from './ShareStudio'
import { Segmented } from './ui'
import { useCountUp } from './useCountUp'

type Tab = 'damage' | 'swimmers' | 'sidequest' | 'allegations'

const TABS: { id: Tab; label: string }[] = [
  { id: 'damage', label: MICROCOPY.tabDamage },
  { id: 'swimmers', label: MICROCOPY.tabSwimmers },
  { id: 'sidequest', label: MICROCOPY.tabSideQuest },
  { id: 'allegations', label: MICROCOPY.tabAllegations },
]

interface Props {
  result: AuditResult
  verdict: Verdict
  copy: CopyPick
  heat: Heat
  achievements: Achievement[]
  seed: number
  onHeat: (heat: Heat) => void
  onReroll: () => void
  onEdit: () => void
  onRestart: () => void
  onReceipts: () => void
}

export function Results(props: Props) {
  const { result, verdict, seed } = props
  const [tab, setTab] = useState<Tab>('damage')
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ damage: null, swimmers: null, sidequest: null, allegations: null })
  const fileNo = `GN-${String(seed % 100000).padStart(5, '0')}`
  const cta = useMemo(() => pick(SHARE_CTAS, mulberry32(seed)), [seed])

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
    <section aria-label="Your results" className="flex flex-1 flex-col">
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:pb-6">
        <div className="min-w-0">
          <div role="tablist" aria-label="Result panels" onKeyDown={onKey} className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-panel/80 p-1 sm:grid-cols-4">
            {TABS.map((t) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[t.id] = el
                }}
                id={`tab-${t.id}`}
                role="tab"
                type="button"
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
                className={`press rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap ${tab === t.id ? 'bg-paper text-ink' : 'text-muted hover:text-paper'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} className="mt-3 focus-visible:outline-offset-8">
            {tab === 'damage' && <DamagePanel {...props} fileNo={fileNo} />}
            {tab === 'swimmers' && <SwimmersPanel {...props} />}
            {tab === 'sidequest' && <SideQuestPanel {...props} />}
            {tab === 'allegations' && (
              <div className="space-y-6">
                <ShareStudio result={result} verdict={verdict} roast={props.copy.roast} achievement={props.achievements[0]?.name ?? null} fileNo={fileNo} seed={seed} />
                <Compare goi={result.goi} />
              </div>
            )}
          </div>
        </div>

        <aside aria-label="Auditor" className="hidden flex-col items-center gap-4 lg:flex">
          <ReactionMascot reaction={verdict.reaction} className="mt-10 h-60 w-60" bubble={props.copy.headline} bubbleSide="top" />
          {tab !== 'allegations' && (
            <button type="button" onClick={() => go('allegations')} className="press inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3.5 font-display text-lg font-extrabold tracking-wide text-ink uppercase shadow-[0_5px_0_#7fae2c] hover:bg-[#d4ff7f]">
              <Send size={18} aria-hidden /> {cta}
            </button>
          )}
          <div className="flex w-full gap-2">
            <button type="button" onClick={props.onEdit} className="press inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line-strong px-3 py-2.5 text-sm hover:border-paper">
              <Pencil size={14} aria-hidden /> {MICROCOPY.editReceipts}
            </button>
            <button type="button" onClick={props.onRestart} className="press inline-flex items-center justify-center gap-1.5 rounded-xl border border-line-strong px-3 py-2.5 text-sm hover:border-paper" aria-label={MICROCOPY.startOver}>
              <RotateCcw size={14} aria-hidden />
            </button>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-ink/95 p-3 backdrop-blur lg:hidden">
        <button type="button" onClick={props.onEdit} className="press grid shrink-0 place-items-center rounded-xl border border-line-strong px-3.5" aria-label={MICROCOPY.editReceipts}>
          <Pencil size={18} aria-hidden />
        </button>
        <button type="button" onClick={props.onRestart} className="press grid shrink-0 place-items-center rounded-xl border border-line-strong px-3.5" aria-label={MICROCOPY.startOver}>
          <RotateCcw size={18} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => (tab === 'allegations' ? document.getElementById('share-actions')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) : go('allegations'))}
          className="press inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3 font-display text-lg font-extrabold tracking-wide text-ink uppercase"
        >
          <Send size={18} aria-hidden /> {tab === 'allegations' ? 'Get the meme' : cta}
        </button>
      </div>
    </section>
  )
}

function Panel({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-line bg-panel/80 p-5 sm:px-7 sm:py-6">{children}</div>
}

function DamagePanel({ result, verdict, copy, heat, achievements, onHeat, onReroll, fileNo }: Props & { fileNo: string }) {
  const reduce = useReducedMotion()
  const goi = useCountUp(result.goi, 1100, 250)
  const sessions = useCountUp(result.sessions, 1100, 250)

  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <p className="min-w-0 pt-1 font-mono text-sm text-lime">{copy.headline}</p>
        <motion.div
          aria-hidden
          initial={reduce ? false : { scale: 2.6, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 520, damping: 22 }}
          className="shrink-0 origin-top-right scale-75 sm:scale-100"
        >
          <Stamp size="md">{verdict.stamp}</Stamp>
        </motion.div>
      </div>
      <h1 id="verdict-title" className="mt-2 font-display text-[clamp(2.3rem,5.4vw,3.9rem)] leading-[0.9] font-black tracking-[-0.01em] uppercase">
        {verdict.name}
      </h1>
      <p className="mt-2 max-w-xl text-paper/85">{verdict.blurb}</p>

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted">{MICROCOPY.goiLong}</p>
          <p className="tabular font-mono text-5xl font-medium text-lime" aria-label={`GOI ${result.goi}`}>
            {Math.round(goi)}
          </p>
          <p className="text-xs text-muted">
            {goiBand(result.goi)}. {GOI_MIN} to {GOI_MAX}, fun only.
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">Lifetime sessions</p>
          <p className="tabular font-mono text-5xl font-medium" aria-label={`${fmtInt(result.sessions)} sessions`}>
            {fmtInt(sessions)}
          </p>
          <p className="text-xs text-muted">about {fmtNum(result.avgPerDay, 2)} a day</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-sm text-muted">Time invested</p>
          <p className="tabular font-mono text-3xl leading-[1.4] font-medium">{fmtDuration(result.time.minutes)}</p>
          <p className="text-xs text-muted">{fmtInt(result.time.hours)} hours total</p>
        </div>
      </div>

      <figure className="mt-5 rounded-xl border-l-4 border-lime bg-ink/60 px-5 py-3.5">
        <blockquote aria-live="polite">
          <motion.p key={copy.roast} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.05] font-bold">
            “{copy.roast}”
          </motion.p>
        </blockquote>
        <figcaption className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" onClick={onReroll} className="press inline-flex items-center gap-1.5 rounded-lg bg-raised px-3 py-1.5 text-sm hover:bg-line-strong">
            <RefreshCw size={14} aria-hidden /> {MICROCOPY.newRoast}
          </button>
          <div className="min-w-[16rem] flex-1 sm:max-w-sm">
            <Segmented label="Roast heat" value={heat} onChange={onHeat} size="sm" options={(['light', 'medium', 'burnt'] as const).map((h) => ({ value: h, label: HEAT_LABELS[h] }))} />
          </div>
        </figcaption>
      </figure>

      <div className="mt-4">
        <p className="flex items-center gap-2 text-sm text-muted">
          <Trophy size={15} className="text-lime" aria-hidden /> {MICROCOPY.achievements} {achievements.length}
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {achievements.map((a, i) => (
            <motion.li
              key={a.id}
              initial={reduce ? false : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.12, type: 'spring', stiffness: 400, damping: 18 }}
              title={a.rule}
              className="rounded-full border border-lime/60 bg-lime/10 px-3 py-1 text-sm font-semibold text-lime"
            >
              {a.name}
            </motion.li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs text-faint">
        File {fileNo}. {MICROCOPY.noDiagnosis}
      </p>
    </Panel>
  )
}

function SwimmersPanel({ result, copy, onReceipts }: Props) {
  const out = result.output
  const cells = useCountUp(out.spermCells, 1000)
  const sci = toScientific(out.spermCells)
  const zero = result.sessions === 0
  return (
    <Panel>
      <p className="font-display text-[clamp(1.9rem,4.6vw,3.2rem)] leading-[0.95] font-black uppercase">{copy.biology[0]}</p>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted">Little swimmers, estimated</p>
          <p className="font-mono text-[clamp(2.4rem,6vw,3.6rem)] leading-none font-medium text-lime" aria-label={fmtBigWords(out.spermCells)}>
            {zero ? '0' : fmtBigWords(cells)}
          </p>
          {!zero && (
            <p className="tabular mt-1 font-mono text-sm text-muted">
              ≈ {sci.mantissa} × 10<sup>{sci.exponent}</sup> cells. Range {fmtBigWords(out.spermRange[0])} to {fmtBigWords(out.spermRange[1])}.
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-muted">Fluid volume, estimated</p>
          <p className="tabular font-mono text-[clamp(2.4rem,6vw,3.6rem)] leading-none font-medium">{fmtVolume(out.totalMl)}</p>
          <p className="mt-1 text-sm text-muted">
            Range {fmtVolume(out.mlRange[0])} to {fmtVolume(out.mlRange[1])}.{out.totalMl >= 2000 && ` About ${fmtCount(out.totalMl / 2000)} two litre bottles. You did not need that image.`}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-coral/50 bg-coral/[0.07] p-4">
        <p className="font-display text-2xl font-black text-coral uppercase">Kids wasted: biology says no.</p>
        <p className="mt-1 font-semibold">{copy.biology[1]}</p>
        <p className="mt-2 text-sm text-muted">
          Only one cell can fertilize an egg, and only if an egg is there. Cells are not children, and this habit does not cause infertility.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <span>
          Using {fmtNum(out.mlPerSession, 1)} mL and {fmtInt(out.spermMillionsPerSession)} million per session
          {out.preset === 'frequent' ? ' (frequent sessions values)' : out.preset === 'median' ? ` (WHO median, ${VOLUME_ML.median.value} mL)` : ' (your custom values)'}
          {out.autoSelected ? ', picked automatically.' : '.'}
        </span>
        <button type="button" onClick={onReceipts} className="press rounded-lg border border-line-strong px-3 py-1.5 text-paper hover:border-paper">
          See the receipts
        </button>
      </div>
    </Panel>
  )
}

function SideQuestPanel({ result, seed, onReceipts }: Props) {
  const items = useMemo(() => {
    const rand = mulberry32(seed)
    const tutorial = ACTIVITIES.find((a) => a.id === 'tutorial')!
    const rest = shuffle(
      ACTIVITIES.filter((a) => a.id !== 'tutorial'),
      rand,
    ).slice(0, 4)
    return [tutorial, ...rest]
  }, [seed])
  const lead = items[1]!
  const zero = result.sessions === 0
  const meter = result.fictional.meter

  return (
    <Panel>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div>
          <p className="text-sm text-muted">Total side quest time</p>
          <p className="tabular font-mono text-[clamp(2rem,5vw,3rem)] leading-tight font-medium text-lime">{fmtDuration(result.time.minutes)}</p>
          <p className="mt-1 text-sm text-muted">
            {fmtInt(result.time.hours)} hours, about {fmtPercent(result.time.shareOfModeledTime)} of all time since the lore began.
          </p>
          {!zero && <p className="mt-3 text-sm text-paper/80">{fill(TIME_LEAD, { count: fmtCount(result.time.minutes / lead.minutes), label: lead.label, each: fmtDuration(lead.minutes) })}</p>}

          <div className="mt-5 rounded-xl border border-line bg-ink/60 p-4">
            <p className="flex items-center justify-between text-sm">
              <span className="font-semibold">Brainrot meter</span>
              <span className="rounded border border-coral/60 px-1.5 font-mono text-[0.7rem] text-coral">fictional</span>
            </p>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-line" role="meter" aria-label="Brainrot meter, fictional" aria-valuemin={0} aria-valuemax={100} aria-valuenow={meter}>
              <motion.div className="h-full rounded-full bg-[repeating-linear-gradient(90deg,#c5ff5c_0_8px,#9fd63a_8px_10px)]" initial={{ width: 0 }} animate={{ width: `${meter}%` }} transition={{ duration: 0.9, delay: 0.2 }} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-muted">Brainrot XP</dt>
                <dd className="tabular font-mono text-xl">{fmtInt(result.fictional.brainrotXP)}</dd>
              </div>
              <div>
                <dt className="text-muted">Aura debt</dt>
                <dd className="tabular font-mono text-xl">{fmtInt(result.fictional.auraDebt)}</dd>
              </div>
            </dl>
            <p className="mt-1 text-xs text-faint">{FICTIONAL.auraDebtPerSession.note}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted">Your alternate timeline</p>
          <ul className="mt-2">
            {items.map((a) => (
              <li key={a.id} className="flex items-baseline gap-3 border-t border-line py-2.5">
                <span className="tabular min-w-[4.25rem] font-mono text-lg text-lime">{fmtCount(result.time.minutes / a.minutes)}</span>
                <span>
                  <span className="block">{fill(TIME_LINES[a.id] ?? '{count} {label}', { count: '' }).trim()}</span>
                  <span className="block text-xs text-faint">Assumes {a.basis}.</span>
                </span>
              </li>
            ))}
          </ul>
          {result.calories && (
            <p className="mt-3 rounded-lg border border-manila/40 px-3 py-2 text-sm text-manila">
              Calorie guess: {fmtInt(result.calories.kcal)} kcal at your {fmtNum(result.calories.kcalPerMinute, 1)} kcal per minute. Sitting still burns about{' '}
              {fmtNum(CALORIES.sittingPerMinute70kg.value, 1)} per minute anyway. Your number, not science.
            </p>
          )}
          <button type="button" onClick={onReceipts} className="press mt-3 text-sm text-muted underline underline-offset-4 hover:text-paper">
            How the time math works
          </button>
        </div>
      </div>
    </Panel>
  )
}

function Compare({ goi }: { goi: number }) {
  const [value, setValue] = useState('')
  const [verdict, setVerdict] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const run = () => {
    const p = parseNumber(value)
    if (!p.ok || p.value < GOI_MIN || p.value > GOI_MAX || !Number.isInteger(p.value)) {
      setVerdict(null)
      setError(`A GOI is a whole number from ${GOI_MIN} to ${GOI_MAX}. Check their card.`)
      return
    }
    setError(null)
    setVerdict(`${compareLine(goi - p.value)} You ${goi} vs them ${p.value}.`)
  }
  return (
    <div className="rounded-2xl border border-line bg-panel/80 p-5">
      <p className="font-display text-2xl font-black uppercase">{MICROCOPY.compareTitle}</p>
      <p className="text-sm text-muted">{MICROCOPY.compareHelp}</p>
      <div className="mt-3 flex gap-2">
        <label htmlFor="friendGoi" className="sr-only">
          {MICROCOPY.compareLabel}
        </label>
        <input
          id="friendGoi"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          inputMode="numeric"
          maxLength={3}
          placeholder="612"
          aria-invalid={error ? true : undefined}
          className="tabular w-28 rounded-xl border border-line-strong bg-ink px-3 py-2.5 font-mono text-xl focus:border-lime focus:outline-none"
        />
        <button type="button" onClick={run} className="press rounded-xl bg-paper px-4 font-semibold text-ink hover:bg-white">
          {MICROCOPY.compareRun}
        </button>
      </div>
      <p role="status" aria-live="polite" className={`mt-2 min-h-5 text-sm ${error ? 'text-coral' : 'text-lime'}`}>
        {error ?? verdict}
      </p>
    </div>
  )
}
