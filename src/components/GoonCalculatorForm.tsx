import { useId, useRef, type FormEvent, type ReactNode } from 'react'
import { CALORIES, SPERM_MILLIONS, VOLUME_ML, type OutputPresetId } from '../lib/assumptions'
import { MICROCOPY } from '../lib/copy/lines'
import { parseNumber, suggestEras, type Errors, type FormState } from '../lib/validate'
import { AdvancedSettings } from './AdvancedSettings'
import { Field } from './Field'

interface Props {
  form: FormState
  errors: Errors
  warnings: string[]
  update: (patch: Partial<FormState>) => void
  onSubmit: () => void
}

const PRESETS: { id: OutputPresetId; title: string; body: string }[] = [
  { id: 'auto', title: 'Auto', body: 'Frequent-session values if you average one or more a day, otherwise the WHO median.' },
  {
    id: 'frequent',
    title: `Frequent: ${VOLUME_ML.frequent.value} mL, ${SPERM_MILLIONS.frequent.value}M`,
    body: 'Measured during two weeks of daily ejaculation. A small study, six men.',
  },
  {
    id: 'median',
    title: `WHO median: ${VOLUME_ML.median.value} mL, ${SPERM_MILLIONS.median.value}M`,
    body: '50th centile of 3,500+ men after 2–7 days without ejaculating.',
  },
  { id: 'custom', title: 'Custom', body: 'Type your own per-session assumptions.' },
]

const MINUTE_CHIPS = [5, 10, 15, 30]

export function GoonCalculatorForm({ form, errors, warnings, update, onSubmit }: Props) {
  const summaryRef = useRef<HTMLDivElement>(null)
  const errorCount = Object.keys(errors).length
  const radioName = useId()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
    // Let React render the new errors, then move focus to the summary.
    requestAnimationFrame(() => summaryRef.current?.focus())
  }

  const switchMode = (mode: FormState['mode']) => {
    if (mode === form.mode) return
    if (mode === 'eras' && form.eras.length === 0) {
      const s = parseNumber(form.startAge)
      const c = parseNumber(form.currentAge)
      const eras = s.ok && c.ok && c.value > s.value ? suggestEras(s.value, c.value) : []
      update({ mode, eras })
      return
    }
    update({ mode })
  }

  return (
    <section id="audit" aria-labelledby="audit-title" className="grid-paper scroll-mt-16 border-b border-line">
      <form noValidate onSubmit={submit} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 id="audit-title" className="font-display text-5xl font-black uppercase sm:text-6xl">
            Intake form
          </h2>
          <p className="mt-3 text-lg text-paper/80">
            Best guesses are fine. Nobody remembers exact numbers, and the audit would be suspicious if you did.
          </p>
        </div>

        <div
          ref={summaryRef}
          tabIndex={-1}
          role={errorCount ? 'alert' : undefined}
          className={errorCount ? 'mt-8 border border-coral/70 bg-coral/10 px-4 py-3 outline-none' : 'sr-only'}
        >
          {errorCount > 0 && (
            <p className="text-coral">
              {errorCount === 1 ? 'One thing needs' : `${errorCount} things need`} fixing before the audit can run. They are marked below.
            </p>
          )}
        </div>

        <Exhibit letter="A" title="The timeline" note="How long the lore runs. Whole years.">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="currentAge" label="Current age" help={MICROCOPY.currentAgeHelp} value={form.currentAge} onChange={(v) => update({ currentAge: v })} error={errors.currentAge} suffix="years" inputMode="numeric" maxLength={3} placeholder="24" />
            <Field id="startAge" label="Starting age" help={MICROCOPY.startAgeHelp} value={form.startAge} onChange={(v) => update({ startAge: v })} error={errors.startAge} suffix="years" inputMode="numeric" maxLength={3} placeholder="14" />
          </div>
        </Exhibit>

        <Exhibit letter="B" title="The frequency" note="Peak days and off days are carved out of the year first, so the regular rate only covers what is left. Nothing is counted twice.">
          <div role="radiogroup" aria-label="How to model frequency" className="mb-6 inline-flex border border-line-strong p-1">
            {(
              [
                ['simple', 'One average for everything'],
                ['eras', 'Split into eras'],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={form.mode === mode}
                onClick={() => switchMode(mode)}
                className={`px-3.5 py-2 text-sm transition-colors ${form.mode === mode ? 'bg-paper text-ink' : 'text-muted hover:text-paper'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {form.mode === 'simple' ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field id="normalPerDay" label="Regular frequency" help={MICROCOPY.normalHelp} value={form.normalPerDay} onChange={(v) => update({ normalPerDay: v })} error={errors.normalPerDay} suffix="per day" placeholder="0.8" />
              <Field id="peakPerDay" label="Peak frequency" help={MICROCOPY.peakHelp} value={form.peakPerDay} onChange={(v) => update({ peakPerDay: v })} error={errors.peakPerDay} suffix="per day" placeholder="same as regular" maxLength={5} />
              <Field id="peakDaysPerYear" label="Peak days per year" help={MICROCOPY.peakDaysHelp} value={form.peakDaysPerYear} onChange={(v) => update({ peakDaysPerYear: v })} error={errors.peakDaysPerYear} suffix="days / yr" inputMode="numeric" maxLength={3} />
              <Field id="offDaysPerYear" label="Off days per year" help={MICROCOPY.offDaysHelp} value={form.offDaysPerYear} onChange={(v) => update({ offDaysPerYear: v })} error={errors.offDaysPerYear} suffix="days / yr" inputMode="numeric" maxLength={3} />
            </div>
          ) : (
            <AdvancedSettings form={form} errors={errors} update={update} />
          )}

          <details className="group mt-6 border-t border-line pt-4" open={form.offPerDay !== '0' && form.offPerDay !== '' ? true : undefined}>
            <summary className="cursor-pointer text-sm text-muted select-none hover:text-paper">Off days are not fully off?</summary>
            <div className="mt-4 max-w-sm">
              <Field id="offPerDay" label="Rate on off days" help={MICROCOPY.offRateHelp} value={form.offPerDay} onChange={(v) => update({ offPerDay: v })} error={errors.offPerDay} suffix="per day" />
            </div>
          </details>

          {warnings.map((w) => (
            <p key={w} className="mt-4 text-sm text-manila">
              {w}
            </p>
          ))}
        </Exhibit>

        <Exhibit letter="C" title="The assumptions" note="The science part. Defaults come from the sources in the methodology; change them if you know better.">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <Field id="minutesPerSession" label="Minutes per session" help={MICROCOPY.minutesHelp} value={form.minutesPerSession} onChange={(v) => update({ minutesPerSession: v })} error={errors.minutesPerSession} suffix="min" maxLength={5}>
                <div className="mt-2 flex gap-2">
                  {MINUTE_CHIPS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => update({ minutesPerSession: String(m) })}
                      aria-pressed={form.minutesPerSession === String(m)}
                      className={`border px-2.5 py-1 font-mono text-xs transition-colors ${
                        form.minutesPerSession === String(m) ? 'border-lime text-lime' : 'border-line-strong text-muted hover:text-paper'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="mt-8 border-t border-line pt-6">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.caloriesEnabled}
                    onChange={(e) => update({ caloriesEnabled: e.target.checked })}
                    className="mt-1 h-4 w-4 accent-lime"
                  />
                  <span>
                    <span className="font-medium">Include an illustrative calorie estimate</span>
                    <span className="mt-1 block text-sm text-muted">{MICROCOPY.caloriesHelp}</span>
                  </span>
                </label>
                {form.caloriesEnabled && (
                  <div className="mt-4 max-w-xs">
                    <Field id="kcalPerMinute" label="Your guess" value={form.kcalPerMinute} onChange={(v) => update({ kcalPerMinute: v })} error={errors.kcalPerMinute} suffix="kcal / min" />
                    <p className="mt-2 text-xs text-muted">
                      For scale: sitting quietly is about {CALORIES.sittingPerMinute70kg.value.toFixed(1)} kcal/min for a 70 kg adult.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <fieldset>
              <legend className="font-medium">Per-session output</legend>
              <p className="mt-1 text-sm text-muted">{MICROCOPY.presetHelp}</p>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {PRESETS.map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer gap-3 border px-3.5 py-3 transition-colors ${
                      form.outputPreset === p.id ? 'border-lime bg-lime/5' : 'border-line-strong hover:border-faint'
                    }`}
                  >
                    <input
                      type="radio"
                      name={radioName}
                      value={p.id}
                      checked={form.outputPreset === p.id}
                      onChange={() => update({ outputPreset: p.id })}
                      className="mt-1 accent-lime"
                    />
                    <span>
                      <span className="block font-mono text-sm">{p.title}</span>
                      <span className="mt-0.5 block text-sm text-muted">{p.body}</span>
                    </span>
                  </label>
                ))}
              </div>
              {form.outputPreset === 'custom' && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Field compact id="customMl" label="Volume" value={form.customMl} onChange={(v) => update({ customMl: v })} error={errors.customMl} suffix="mL" />
                  <Field compact id="customSpermMillions" label="Total sperm" value={form.customSpermMillions} onChange={(v) => update({ customSpermMillions: v })} error={errors.customSpermMillions} suffix="million" />
                </div>
              )}
            </fieldset>
          </div>
        </Exhibit>

        <div className="mt-12 flex flex-col items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-muted">{MICROCOPY.ctaHelp}</p>
          <button
            type="submit"
            className="w-full bg-lime px-8 py-4 font-display text-xl font-extrabold tracking-wide text-ink uppercase transition-colors hover:bg-[#d4ff7f] sm:w-auto"
          >
            {MICROCOPY.cta}
          </button>
        </div>
      </form>
    </section>
  )
}

function Exhibit({ letter, title, note, children }: { letter: string; title: string; note: string; children: ReactNode }) {
  return (
    <fieldset className="mt-12 grid grid-cols-1 gap-6 border-t border-line pt-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10">
      <legend className="sr-only">
        Exhibit {letter}: {title}
      </legend>
      <div>
        <p aria-hidden className="font-mono text-xs text-lime">Exhibit {letter}</p>
        <p aria-hidden className="mt-1 font-display text-3xl font-extrabold uppercase">{title}</p>
        <p className="mt-2 text-sm leading-snug text-muted">{note}</p>
      </div>
      <div>{children}</div>
    </fieldset>
  )
}
