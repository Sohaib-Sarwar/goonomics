import { Pencil, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CALORIES, FICTIONAL, SPERM_MILLIONS, VOLUME_ML } from '../lib/assumptions'
import { MICROCOPY, TIME_DISCLAIMER, TIME_LINES } from '../lib/copy/lines'
import { fill, mulberry32 } from '../lib/copy/select'
import type { Verdict } from '../lib/copy/verdicts'
import { fmtBigWords, fmtCount, fmtDuration, fmtInt, fmtNum, fmtPercent, fmtVolume, toScientific } from '../lib/format'
import type { AuditResult } from '../lib/types'
import { Mascot } from './Mascot'
import { RoastGenerator } from './RoastGenerator'
import { ShareableReport } from './ShareableReport'
import { Cite, KindBadge, StatisticCard } from './StatisticCard'
import { VerdictCard } from './VerdictCard'

interface Props {
  result: AuditResult
  verdict: Verdict
  copy: { headline: string; roast: string; biology: string[]; sharePrompt: string }
  seed: number
  onReroll: () => void
  onEdit: () => void
  onRestart: () => void
}

const VISIBLE_COMPARISONS = 6

export function ResultsDashboard({ result, verdict, copy, seed, onReroll, onEdit, onRestart }: Props) {
  const headingRef = useRef<HTMLDivElement>(null)
  const [showAll, setShowAll] = useState(false)
  const fileNo = `GN-${String(seed % 100000).padStart(5, '0')}`

  useEffect(() => {
    headingRef.current?.focus()
    window.scrollTo({ top: 0 })
  }, [])

  // Deterministic order of time comparisons for this file.
  const comparisons = useMemo(() => {
    const rand = mulberry32(seed)
    return [...result.time.comparisons].map((c) => ({ c, k: rand() })).sort((a, b) => a.k - b.k).map(({ c }) => c)
  }, [result.time.comparisons, seed])
  const lead = comparisons[0]!

  const out = result.output
  const preset = out.preset === 'custom' ? null : out.preset
  const sci = toScientific(out.spermCells)
  const isZero = result.sessions === 0

  return (
    <article aria-labelledby="verdict-title" className="grid-paper pb-24">
      <div ref={headingRef} tabIndex={-1} className="outline-none">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pt-8 sm:px-6">
          <p className="font-mono text-xs text-muted">
            Report {fileNo}. All figures are estimates from your own guesses.
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={onEdit} className="inline-flex items-center gap-2 border border-line-strong px-3 py-1.5 text-sm hover:border-paper">
              <Pencil size={14} aria-hidden /> {MICROCOPY.edit}
            </button>
            <button type="button" onClick={onRestart} className="inline-flex items-center gap-2 border border-line-strong px-3 py-1.5 text-sm hover:border-paper">
              <RotateCcw size={14} aria-hidden /> {MICROCOPY.restart}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 max-w-6xl space-y-14 px-4 sm:px-6">
        <VerdictCard verdict={verdict} headline={copy.headline} fileNo={fileNo} />

        <RoastGenerator roast={copy.roast} onReroll={onReroll} />

        <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-12">
          <StatisticCard index={2} title="Lifetime session ledger" id="ledger" className="lg:col-span-7">
            <p className="tabular font-mono text-[clamp(3.5rem,13vw,8rem)] leading-none font-medium tracking-tight text-lime">{fmtInt(result.sessions)}</p>
            <p className="mt-3 max-w-lg text-paper/85">
              Estimated sessions across {fmtNum(result.years, 0)} {result.years === 1 ? 'year' : 'years'} of lore, about{' '}
              <span className="tabular font-mono">{fmtNum(result.avgPerDay, 2)}</span> per day on average.
            </p>
            {result.segments.length > 1 && (
              <table className="mt-6 w-full max-w-lg text-sm">
                <caption className="sr-only">Sessions by era</caption>
                <thead>
                  <tr className="text-left text-muted">
                    <th scope="col" className="py-1.5 font-normal">Era</th>
                    <th scope="col" className="py-1.5 font-normal">Ages</th>
                    <th scope="col" className="py-1.5 text-right font-normal">Sessions</th>
                  </tr>
                </thead>
                <tbody className="tabular font-mono">
                  {result.segments.map((s) => (
                    <tr key={`${s.label}-${s.fromAge}`} className="border-t border-line">
                      <td className="py-2 font-sans">{s.label}</td>
                      <td className="py-2 text-muted">
                        {s.fromAge}–{s.toAge}
                      </td>
                      <td className="py-2 text-right">{fmtInt(s.sessions)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {result.uncoveredYears > 0.01 && (
              <p className="mt-3 text-sm text-manila">{fmtNum(result.uncoveredYears, 0)} uncovered years counted as zero.</p>
            )}
          </StatisticCard>

          <StatisticCard title="Brainrot meter" className="lg:col-span-5">
            <p className="text-sm text-muted">
              <KindBadge kind="fictional" /> Made-up metric. Log scale, maxes out at {fmtInt(FICTIONAL.meterCeilingSessions.value)} sessions.
            </p>
            <div className="mt-5" role="meter" aria-label="Brainrot meter, fictional" aria-valuemin={0} aria-valuemax={100} aria-valuenow={result.fictional.meter}>
              <div className="relative h-5 border border-line-strong bg-ink">
                <div className="h-full bg-[repeating-linear-gradient(90deg,#c5ff5c_0_8px,#9fd63a_8px_10px)]" style={{ width: `${result.fictional.meter}%` }} />
                {[25, 50, 75].map((t) => (
                  <span key={t} aria-hidden className="absolute top-0 h-full w-px bg-line-strong" style={{ left: `${t}%` }} />
                ))}
              </div>
              <div className="mt-1.5 flex justify-between font-mono text-[0.68rem] text-faint">
                <span>touching grass</span>
                <span>locked in (wrong thing)</span>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-muted">Brainrot XP</dt>
                <dd className="tabular font-mono text-2xl">{fmtInt(result.fictional.brainrotXP)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Aura lost to the void</dt>
                <dd className="tabular font-mono text-2xl">{fmtInt(result.fictional.auraLost)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-faint">Aura calculated at the industry-standard {FICTIONAL.auraPerSession.value} per session. The industry is us.</p>
          </StatisticCard>

          <StatisticCard index={3} title="The little swimmer ledger" id="swimmers" className="lg:col-span-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div>
                <p className="font-mono text-[clamp(2.4rem,8vw,4.75rem)] leading-none font-medium text-paper">{isZero ? '0' : fmtBigWords(out.spermCells)}</p>
                {!isZero && (
                  <p className="tabular mt-2 font-mono text-muted">
                    ≈ {sci.mantissa} × 10<sup>{sci.exponent}</sup> sperm cells
                  </p>
                )}
                <p className="mt-3 text-sm text-muted">
                  Plausible range {fmtBigWords(out.spermRange[0])} to {fmtBigWords(out.spermRange[1])}, using {fmtInt(out.spermMillionsPerSession)} million per
                  session{preset ? '' : ' (your custom value)'}.
                </p>

                <div className="mt-8 border border-coral/50 bg-coral/[0.06] p-5">
                  <p className="font-display text-3xl leading-none font-black text-coral uppercase sm:text-4xl">Potential kids wasted: biology says no.</p>
                  <ul className="mt-4 space-y-2 text-paper/90">
                    {copy.biology.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    The real science: each ejaculate carries millions of cells, only one can fertilize an egg, it needs an egg to be there at the right
                    time, and most cells never get close. So a sperm count cannot be turned into a number of children. Masturbation also does not
                    cause infertility or a lower sperm count. <Cite ids={['goAskAlice2025', 'cleveland2022', 'issm2022']} />
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted">Estimated fluid volume</p>
                  <p className="tabular mt-1 font-mono text-5xl">{fmtVolume(out.totalMl)}</p>
                  {out.totalMl >= 1000 && <p className="tabular mt-1 font-mono text-sm text-muted">{fmtInt(out.totalMl)} mL</p>}
                  <p className="mt-2 text-sm text-muted">
                    Range {fmtVolume(out.mlRange[0])} to {fmtVolume(out.mlRange[1])}.
                    {out.totalMl >= 2000 && ` About ${fmtCount(out.totalMl / 2000)} two-litre bottles, if you need a mental image. You do not.`}
                  </p>
                </div>
                <dl className="divide-y divide-line border-y border-line text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                    <dt className="text-muted">Assumption used</dt>
                    <dd className="flex items-center gap-2">
                      <span className="tabular font-mono">
                        {fmtNum(out.mlPerSession, 1)} mL, {fmtInt(out.spermMillionsPerSession)}M
                      </span>
                      <KindBadge kind={preset === 'frequent' ? 'measured-average' : preset === 'median' ? 'population-median' : 'selected-assumption'} />
                    </dd>
                  </div>
                  <div className="py-2.5 text-muted">
                    {preset === 'frequent' && (
                      <>
                        {out.autoSelected && 'Auto-selected because you average one or more a day. '}
                        {VOLUME_ML.frequent.note} <Cite ids={VOLUME_ML.frequent.sources} />
                      </>
                    )}
                    {preset === 'median' && (
                      <>
                        {out.autoSelected && 'Auto-selected because you average under one a day. '}
                        {VOLUME_ML.median.note} <Cite ids={VOLUME_ML.median.sources} />
                      </>
                    )}
                    {!preset && 'Custom values you entered. We trust you. Mostly.'}
                  </div>
                  <div className="py-2.5 text-muted">
                    Not to be confused with the WHO lower reference limit ({VOLUME_ML.referenceLimit.value} mL, {SPERM_MILLIONS.referenceLimit.value}M), which is the
                    5th centile, not an average.
                  </div>
                </dl>
              </div>
            </div>
          </StatisticCard>

          <StatisticCard index={4} title="The side-quest opportunity cost" id="time" className="lg:col-span-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
              <div>
                <p className="tabular font-mono text-[clamp(2.2rem,6vw,3.75rem)] leading-[1.05] font-medium">
                  {fmtDuration(result.time.minutes)
                    .split(', ')
                    .map((part, i, all) => (
                      <span key={part} className="inline-block whitespace-nowrap">
                        {part}
                        {i < all.length - 1 && ',\u00a0'}
                      </span>
                    ))}
                </p>
                <p className="mt-3 text-paper/85">
                  {fmtInt(result.time.hours)} hours of modeled time, roughly {fmtPercent(result.time.shareOfModeledTime)} of every minute since the lore
                  began.
                </p>
                {!isZero && (
                  <p className="mt-4 text-sm text-muted">
                    {fill(TIME_DISCLAIMER, { count: fmtCount(lead.count), label: lead.label, each: fmtDuration(lead.minutesEach) })}
                  </p>
                )}
                <Mascot className="mt-6 hidden h-40 w-40 lg:block" mood="buried" decorative />
              </div>
              <div>
                <p className="text-sm text-muted">Hypothetical alternative uses of that time</p>
                <ul className="mt-3">
                  {(showAll ? comparisons : comparisons.slice(0, VISIBLE_COMPARISONS)).map((c) => (
                    <li key={c.id} className="border-t border-line py-3">
                      <div className="flex items-baseline gap-3">
                        <span className="tabular min-w-[4.5rem] font-mono text-xl text-lime">{fmtCount(c.count)}</span>
                        <span className="text-paper/90">{fill(TIME_LINES[c.id] ?? '{count} {label}', { count: '', label: c.label }).replace(/^ /, '')}</span>
                      </div>
                      <p className="mt-1 pl-[5.25rem] text-xs text-faint">{c.basis}</p>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-2 text-sm text-muted underline underline-offset-4 hover:text-paper" aria-expanded={showAll}>
                  {showAll ? 'Show fewer' : `Show all ${comparisons.length} comparisons`}
                </button>
              </div>
            </div>
          </StatisticCard>

          {result.calories && (
            <StatisticCard title="Illustrative calories" className="lg:col-span-7">
              <p className="text-sm text-muted">
                <KindBadge kind="selected-assumption" /> Built on your guess of {fmtNum(result.calories.kcalPerMinute, 1)} kcal/min. No study has measured this
                activity. <Cite ids={CALORIES.illustrativeDefault.sources} />
              </p>
              <dl className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted">Total at your guess</dt>
                  <dd className="tabular font-mono text-4xl">{fmtInt(result.calories.kcal)} kcal</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted">Beyond just sitting there</dt>
                  <dd className="tabular font-mono text-4xl">{fmtInt(result.calories.extraKcal)} kcal</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-muted">
                Sitting quietly burns about {fmtNum(CALORIES.sittingPerMinute70kg.value, 1)} kcal/min for a 70 kg adult anyway{' '}
                <Cite ids={CALORIES.sittingPerMinute70kg.sources} />. For a different activity entirely, partnered sex measured around{' '}
                {CALORIES.partneredMenPerMinute.value} kcal/min in young men <Cite ids={CALORIES.partneredMenPerMinute.sources} />.
              </p>
            </StatisticCard>
          )}
        </div>

        <p className="max-w-3xl border-t border-line pt-6 text-sm leading-relaxed text-muted">{MICROCOPY.noDiagnosis}</p>

        <section aria-labelledby="share-title">
          <h2 id="share-title" className="flex items-baseline gap-3">
            <span className="tabular font-mono text-xs text-lime">§5</span>
            <span className="font-display text-4xl font-black uppercase sm:text-5xl">Your report card</span>
          </h2>
          <p className="mt-2 mb-6 text-muted">{copy.sharePrompt}</p>
          <ShareableReport result={result} verdict={verdict} roast={copy.roast} sharePrompt={copy.sharePrompt} fileNo={fileNo} />
        </section>
      </div>
    </article>
  )
}
