import {
  CALORIES,
  CONCENTRATION_MEDIAN,
  DAYS_PER_YEAR,
  DEFAULT_MINUTES_PER_SESSION,
  FICTIONAL,
  SPERM_MILLIONS,
  VOLUME_ML,
  type Assumption,
} from '../lib/assumptions'
import { SOURCES } from '../lib/sources'
import { Cite, KindBadge } from './StatisticCard'

const STEPS = [
  `Years of lore = current age minus starting age. Each year is ${DAYS_PER_YEAR} days, the average Gregorian year, so leap days are spread evenly instead of guessed.`,
  'Sessions per year = peak days × peak rate + off days × off-day rate + every remaining day × regular rate. Peak and off days come out of the year first, so no day is counted twice.',
  'In era mode each era is calculated on its own and summed. Overlapping eras are rejected, and years outside every era count as zero.',
  'Volume and sperm cells = lifetime sessions × the per-session assumption you picked. The range uses the 25th to 75th centile of the WHO dataset.',
  'Time = lifetime sessions × your minutes per session. Comparisons divide that by a stated duration per activity.',
  'Brainrot XP, aura and the meter are invented for comedy and labelled as fictional everywhere.',
]

const ROWS: [string, Assumption][] = [
  ['Volume per ejaculate, median', VOLUME_ML.median],
  ['Volume, 25th / 75th centile', { ...VOLUME_ML.p25, value: VOLUME_ML.p25.value, unit: `mL / ${VOLUME_ML.p75.value} mL`, note: 'Used for the uncertainty range.' }],
  ['Volume, frequent sessions', VOLUME_ML.frequent],
  ['Volume, lower reference limit', VOLUME_ML.referenceLimit],
  ['Total sperm per ejaculate, median', SPERM_MILLIONS.median],
  ['Total sperm, 25th / 75th centile', { ...SPERM_MILLIONS.p25, unit: `million / ${SPERM_MILLIONS.p75.value} million`, note: 'Used for the uncertainty range.' }],
  ['Total sperm, frequent sessions', SPERM_MILLIONS.frequent],
  ['Total sperm, lower reference limit', SPERM_MILLIONS.referenceLimit],
  ['Sperm concentration, median', CONCENTRATION_MEDIAN],
  ['Minutes per session (default)', DEFAULT_MINUTES_PER_SESSION],
  ['Calories per minute (optional)', CALORIES.illustrativeDefault],
  ['Sitting quietly, 70 kg adult', { ...CALORIES.sittingPerMinute70kg, value: Number(CALORIES.sittingPerMinute70kg.value.toFixed(2)) }],
  ['Partnered sex, young men', CALORIES.partneredMenPerMinute],
  ['Aura per session', FICTIONAL.auraPerSession],
]

export function Methodology() {
  return (
    <section id="methodology" aria-labelledby="method-title" className="scroll-mt-16 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <h2 id="method-title" className="font-display text-5xl font-black uppercase sm:text-6xl">
              Methodology
            </h2>
            <p className="mt-4 max-w-md text-lg text-paper/85">
              The jokes are fake. The math is not. Here is exactly how a pile of guesses becomes a very official-looking report.
            </p>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
              <p>
                <strong className="font-semibold text-paper">Everything starts from your memory.</strong> Retrospective estimates are fuzzy, so every output is an
                estimate with a range, not a measurement.
              </p>
              <p>
                <strong className="font-semibold text-paper">Medians, not reference limits.</strong> The WHO manual publishes a 5th-centile “lower reference
                limit” (1.4 mL, 39 million). That is a clinical cut-off, not what a typical person produces, so we only show it for contrast.
              </p>
              <p>
                <strong className="font-semibold text-paper">Total, not concentration.</strong> Sperm per mL and sperm per ejaculate are different numbers. We
                use the total-per-ejaculate column, so nothing gets multiplied by the wrong thing.
              </p>
              <p>
                <strong className="font-semibold text-paper">Frequency matters.</strong> The WHO data come from samples after 2–7 days without ejaculating.
                Daily ejaculation measurably lowers volume and count, which is why Auto switches to frequent-session values at one or more a day.
              </p>
              <p>
                <strong className="font-semibold text-paper">No calorie value exists.</strong> We found no study measuring solo sessions, and the Compendium
                of Physical Activities has no entry for it. So calories are an opt-in guess, and the main energy stat is openly fictional.
              </p>
              <p>
                <strong className="font-semibold text-paper">Cells are not kids.</strong> Only one sperm can fertilize an egg, and only if an egg is there.
                Converting cell counts into “potential children” is not a thing, so we turned it into a joke instead.
              </p>
              <p>
                <strong className="font-semibold text-paper">No health scare.</strong> Cleveland Clinic and the International Society for Sexual Medicine
                both say masturbation does not cause infertility, lower sperm count, weakness or mental illness. If it ever feels compulsive, talk to a
                professional. <Cite ids={['cleveland2022', 'issm2022']} />
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl font-extrabold uppercase">The formula, in order</h3>
            <ol className="mt-4 space-y-3">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-4 border-t border-line pt-3">
                  <span className="tabular font-mono text-sm text-lime">{i + 1}</span>
                  <span className="text-paper/90">{step}</span>
                </li>
              ))}
            </ol>

            <h3 className="mt-12 font-display text-2xl font-extrabold uppercase">Every number we use</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[34rem] text-sm">
                <caption className="sr-only">Assumptions with units, type and sources</caption>
                <thead>
                  <tr className="text-left text-muted">
                    <th scope="col" className="py-2 pr-3 font-normal">Assumption</th>
                    <th scope="col" className="py-2 pr-3 font-normal">Value</th>
                    <th scope="col" className="py-2 pr-3 font-normal">Type</th>
                    <th scope="col" className="py-2 font-normal">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(([label, a]) => (
                    <tr key={label} className="border-t border-line align-top">
                      <td className="py-2.5 pr-3">
                        {label}
                        <p className="mt-0.5 text-xs text-faint">{a.note}</p>
                      </td>
                      <td className="tabular py-2.5 pr-3 font-mono whitespace-nowrap">
                        {a.value} <span className="text-muted">{a.unit}</span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <KindBadge kind={a.kind} />
                      </td>
                      <td className="py-2.5">{a.sources.length ? <Cite ids={a.sources} /> : <span className="text-xs text-faint">none, by design</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-12 font-display text-2xl font-extrabold uppercase">Sources</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {Object.values(SOURCES).map((s) => (
                <li key={s.id} className="border-t border-line pt-3">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-paper underline decoration-line-strong underline-offset-4 hover:decoration-lime">
                    {s.title}
                  </a>
                  <p className="mt-0.5 text-muted">
                    {s.publisher}, {s.date}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
