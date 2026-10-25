import { ChevronDown } from 'lucide-react'
import { ACHIEVEMENTS } from '../lib/achievements'
import {
  ACTIVITIES,
  CALORIES,
  CONCENTRATION_MEDIAN,
  DAYS_PER_YEAR,
  DEFAULT_MINUTES_PER_SESSION,
  FICTIONAL,
  SPERM_MILLIONS,
  VOLUME_ML,
  type Assumption,
  type AssumptionKind,
} from '../lib/assumptions'
import { MICROCOPY } from '../lib/copy/lines'
import { GOI_BANDS } from '../lib/goi'
import { SOURCES, type SourceId } from '../lib/sources'
import { Sheet } from './ui'

const QA: [string, string][] = [
  ['What did you actually calculate?', 'Your lifetime estimate, from the numbers you typed. We did not hack your browser history.'],
  ['Where did the science come from?', 'WHO lab data and medical sources. Not a random guy in the comments.'],
  ['Are those actual calories?', 'Only if you switch on the calorie guess, and then it is labelled as your guess. No gym science for the plot.'],
  ['Did I actually waste those kids?', 'No. Sperm cells are cells, not tiny babies. Please let biology finish its sentence.'],
  ['Are these exact numbers?', 'Nope. They are estimates from memory. Your history was never recorded by this website.'],
  ['Is my lore private?', 'It never leaves your device. No server, no analytics, no cookies. The share image is made on your phone or laptop.'],
  ['What is the GOI?', 'A made up score from 300 to 850, like a credit score for lore. It does not measure health, habits or character.'],
]

const KIND: Record<AssumptionKind, string> = {
  'population-median': 'population median',
  'measured-average': 'small study average',
  'reference-limit': 'clinical cut off, not an average',
  'selected-assumption': 'our assumption',
  fictional: 'fictional',
}

const ROWS: [string, Assumption][] = [
  ['Volume per session, median', VOLUME_ML.median],
  ['Volume, frequent sessions', VOLUME_ML.frequent],
  ['Volume, WHO lower limit', VOLUME_ML.referenceLimit],
  ['Total sperm per session, median', SPERM_MILLIONS.median],
  ['Total sperm, frequent sessions', SPERM_MILLIONS.frequent],
  ['Total sperm, WHO lower limit', SPERM_MILLIONS.referenceLimit],
  ['Sperm concentration, median', CONCENTRATION_MEDIAN],
  ['Session length, default', DEFAULT_MINUTES_PER_SESSION],
  ['Calorie guess, default', CALORIES.illustrativeDefault],
  ['Sitting still, 70 kg adult', { ...CALORIES.sittingPerMinute70kg, value: Number(CALORIES.sittingPerMinute70kg.value.toFixed(2)) }],
  ['Partnered sex, young men', CALORIES.partneredMenPerMinute],
  ['Aura debt per session', FICTIONAL.auraDebtPerSession],
]

const STEPS = [
  `Years of lore = current age minus starting age. A year is ${DAYS_PER_YEAR} days, the average calendar year, so leap days are spread evenly.`,
  'Per year: peak days × peak rate, plus locked in days × their rate, plus every remaining day × your daily rate. Peak and locked in days come out first, so no day counts twice.',
  'Eras are calculated one by one and added up. Overlapping eras are rejected. Years outside every era count as zero.',
  'Volume and swimmers = sessions × the per session preset. Ranges use the 25th to 75th percentile of the WHO data.',
  'Time = sessions × session length. Each comparison divides that by the duration shown next to it.',
  'GOI = 300 + 550 × (0.75 × volume score + 0.25 × intensity score), both on log scales capped at 50,000 sessions and 4 a day.',
]

export function Cite({ ids }: { ids: readonly SourceId[] }) {
  if (ids.length === 0) return <span className="text-xs text-faint">none, on purpose</span>
  return (
    <span className="text-xs">
      {ids.map((id, i) => (
        <span key={id}>
          {i > 0 && ', '}
          <a href={SOURCES[id].url} target="_blank" rel="noopener noreferrer" className="text-muted underline decoration-line-strong underline-offset-2 hover:text-paper">
            {SOURCES[id].short}
          </a>
        </span>
      ))}
    </span>
  )
}

/** Compact, funny methodology in a dismissible sheet. The full science sits behind one toggle. */
export function ReceiptsModal({ open, onClose, showScience = false }: { open: boolean; onClose: () => void; showScience?: boolean }) {
  return (
    <Sheet open={open} onClose={onClose} title={MICROCOPY.infoButton}>
      <dl className="space-y-3">
        {QA.map(([q, a]) => (
          <div key={q}>
            <dt className="font-semibold">{q}</dt>
            <dd className="text-sm text-muted">{a}</dd>
          </div>
        ))}
      </dl>

      <details className="group mt-5 rounded-xl border border-line" open={showScience || undefined}>
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold select-none">
          Show the actual science
          <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="space-y-5 border-t border-line px-4 py-4 text-sm">
          <ol className="space-y-2">
            {STEPS.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="tabular font-mono text-lime">{i + 1}</span>
                <span className="text-paper/90">{s}</span>
              </li>
            ))}
          </ol>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem]">
              <caption className="sr-only">Every number the calculator uses</caption>
              <thead>
                <tr className="text-left text-muted">
                  <th scope="col" className="py-1.5 pr-3 font-normal">Number</th>
                  <th scope="col" className="py-1.5 pr-3 font-normal">Value</th>
                  <th scope="col" className="py-1.5 pr-3 font-normal">Type</th>
                  <th scope="col" className="py-1.5 font-normal">Source</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, a]) => (
                  <tr key={label} className="border-t border-line align-top">
                    <td className="py-2 pr-3">{label}</td>
                    <td className="tabular py-2 pr-3 font-mono whitespace-nowrap">
                      {a.value} <span className="text-muted">{a.unit.replace(' per ejaculate', '')}</span>
                    </td>
                    <td className="py-2 pr-3 text-muted">{KIND[a.kind]}</td>
                    <td className="py-2">
                      <Cite ids={a.sources} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <p className="font-semibold">Alternate timeline durations</p>
            <p className="text-muted">
              {ACTIVITIES.map((a) => `${a.label}: ${a.basis}`).join('. ')}. Reading speed from <Cite ids={['brysbaert2019']} />.
            </p>
          </div>

          <div>
            <p className="font-semibold">GOI bands and achievements</p>
            <p className="text-muted">{GOI_BANDS.map((b) => `${b.min}+ ${b.label}`).join('. ')}.</p>
            <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {ACHIEVEMENTS.map((a) => (
                <li key={a.id} className="text-muted">
                  <span className="text-paper">{a.name}:</span> {a.rule}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold">Health, briefly</p>
            <p className="text-muted">
              Masturbation does not cause infertility, a lower sperm count or weakness <Cite ids={['cleveland2022', 'issm2022']} />. If it ever feels out of control, a professional can help, no judgment.
            </p>
          </div>

          <div>
            <p className="font-semibold">Sources</p>
            <ul className="mt-1 space-y-1.5">
              {Object.values(SOURCES).map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line-strong underline-offset-2 hover:decoration-lime">
                    {s.title}
                  </a>
                  <span className="text-muted">
                    {' '}
                    {s.publisher}, {s.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </Sheet>
  )
}
