import { ChevronDown, Settings2 } from 'lucide-react'
import type { FormEvent } from 'react'
import { SPERM_MILLIONS, VOLUME_ML, type OutputPresetId } from '../lib/assumptions'
import { MICROCOPY, RECEIPT_BUBBLES } from '../lib/copy/lines'
import { HEAT_LABELS, type Heat } from '../lib/copy/roasts'
import { parseNumber, suggestEras, type Errors, type FormState } from '../lib/validate'
import { ErasEditor } from './AdvancedSettings'
import { Field } from './Field'
import { ReactionMascot } from './Mascot'
import { GhostButton, PrimaryButton, Segmented, SliderField } from './ui'

interface Props {
  form: FormState
  errors: Errors
  warnings: string[]
  update: (patch: Partial<FormState>) => void
  touch: (key: string) => void
  onBack: () => void
  onNext: () => void
}

const HEATS: { value: Heat; label: string }[] = (['light', 'medium', 'burnt'] as const).map((h) => ({ value: h, label: HEAT_LABELS[h] }))

const PRESETS: { value: OutputPresetId; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'frequent', label: `Frequent ${VOLUME_ML.frequent.value} mL` },
  { value: 'median', label: `WHO median ${VOLUME_ML.median.value} mL` },
  { value: 'custom', label: 'Custom' },
]

export function StepReceipts({ form, errors, warnings, update, touch, onBack, onNext }: Props) {
  const daily = parseNumber(form.normalPerDay)
  const peakDays = parseNumber(form.peakDaysPerYear)
  const showPeakRate = form.mode === 'simple' && peakDays.ok && peakDays.value > 0
  const level = form.mode === 'eras' ? 'mid' : !daily.ok ? 'empty' : daily.value === 0 ? 'zero' : daily.value < 0.5 ? 'low' : daily.value < 1.5 ? 'mid' : 'high'
  const reaction = level === 'high' ? 'shock' : level === 'mid' ? 'sweat' : level === 'zero' ? 'professor' : 'audit'
  const nerdErrors = ['minutesPerSession', 'customMl', 'customSpermMillions', 'kcalPerMinute', 'offPerDay', 'eras'].some((k) => errors[k]) || Object.keys(errors).some((k) => k.startsWith('eras.'))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onNext()
  }

  const toggleEras = (on: boolean) => {
    if (!on) return update({ mode: 'simple' })
    const s = parseNumber(form.startAge)
    const c = parseNumber(form.currentAge)
    update({ mode: 'eras', eras: form.eras.length ? form.eras : s.ok && c.ok && c.value > s.value ? suggestEras(s.value, c.value) : [] })
  }

  return (
    <section aria-labelledby="receipts-title" className="grid-paper flex flex-1 flex-col">
      <form noValidate onSubmit={submit} className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-start gap-6 px-4 pb-32 sm:px-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.6fr)] md:items-center md:pb-6">
        <div className="max-w-2xl">
          <h1 id="receipts-title" className="font-display text-[clamp(2.5rem,6vw,3.9rem)] leading-[0.88] font-black uppercase">
            {MICROCOPY.receiptsTitle}
          </h1>
          <p className="mt-2 text-paper/80">{MICROCOPY.receiptsSub}</p>

          <div className="mt-4 space-y-4">
            {form.mode === 'simple' ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                <SliderField
                  id="normalPerDay"
                  label={MICROCOPY.daily}
                  hint={MICROCOPY.dailyHint}
                  value={form.normalPerDay}
                  onChange={(v) => update({ normalPerDay: v })}
                  onBlur={() => touch('normalPerDay')}
                  min={0}
                  max={5}
                  step={0.1}
                  unit="/ day"
                  error={errors.normalPerDay}
                />
                <SliderField
                  id="peakDaysPerYear"
                  label={MICROCOPY.peakDays}
                  hint={MICROCOPY.peakDaysHint}
                  value={form.peakDaysPerYear}
                  onChange={(v) => update({ peakDaysPerYear: v.includes('.') ? String(Math.round(Number(v))) : v })}
                  onBlur={() => touch('peakDaysPerYear')}
                  min={0}
                  max={365}
                  step={1}
                  unit="days"
                  error={errors.peakDaysPerYear}
                />
                {showPeakRate && (
                  <SliderField
                    id="peakPerDay"
                    label={MICROCOPY.peakRate}
                    hint={MICROCOPY.peakRateHint}
                    value={form.peakPerDay}
                    onChange={(v) => update({ peakPerDay: v })}
                    onBlur={() => touch('peakPerDay')}
                    min={0}
                    max={10}
                    step={0.5}
                    unit="/ day"
                    error={errors.peakPerDay}
                  />
                )}
                <SliderField
                  id="offDaysPerYear"
                  label={MICROCOPY.lockedDays}
                  hint={MICROCOPY.lockedDaysHint}
                  value={form.offDaysPerYear}
                  onChange={(v) => update({ offDaysPerYear: v })}
                  onBlur={() => touch('offDaysPerYear')}
                  min={0}
                  max={365}
                  step={1}
                  unit="days"
                  error={errors.offDaysPerYear}
                />
              </div>
            ) : (
              <p className="rounded-xl border border-lime/40 bg-lime/5 px-4 py-3 text-sm">Eras mode is on. Set each era in Nerd settings below.</p>
            )}

            <Segmented label={MICROCOPY.heat} hint={MICROCOPY.heatHint} value={form.heat} options={HEATS} onChange={(heat) => update({ heat })} />

            <details className="group rounded-xl border border-line bg-panel/70" open={nerdErrors || form.mode === 'eras' ? true : undefined}>
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 select-none">
                <Settings2 size={16} className="text-lime" aria-hidden />
                <span className="font-semibold">{MICROCOPY.nerdSettings}</span>
                <span className="hidden truncate text-sm text-muted sm:inline">{MICROCOPY.nerdSettingsHint}</span>
                <ChevronDown size={16} className="ml-auto transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="space-y-5 border-t border-line px-4 py-4">
                <Segmented
                  label={MICROCOPY.sessionLength}
                  size="sm"
                  value={['5', '10', '15', '30'].includes(form.minutesPerSession) ? form.minutesPerSession : '15'}
                  options={['5', '10', '15', '30'].map((m) => ({ value: m, label: `${m} min` }))}
                  onChange={(m) => update({ minutesPerSession: m })}
                />
                {errors.minutesPerSession && <p className="text-sm text-coral">{errors.minutesPerSession}</p>}

                <div>
                  <Segmented label={MICROCOPY.preset} size="sm" value={form.outputPreset} options={PRESETS} onChange={(outputPreset) => update({ outputPreset })} />
                  <p className="mt-1.5 text-xs text-muted">
                    Auto uses frequent values ({VOLUME_ML.frequent.value} mL, {SPERM_MILLIONS.frequent.value}M) at one a day or more, otherwise the WHO median ({VOLUME_ML.median.value} mL,{' '}
                    {SPERM_MILLIONS.median.value}M).
                  </p>
                  {form.outputPreset === 'custom' && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <Field compact id="customMl" label="Volume" value={form.customMl} onChange={(v) => update({ customMl: v })} error={errors.customMl} suffix="mL" />
                      <Field compact id="customSpermMillions" label="Total sperm" value={form.customSpermMillions} onChange={(v) => update({ customSpermMillions: v })} error={errors.customSpermMillions} suffix="million" />
                    </div>
                  )}
                </div>

                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" checked={form.mode === 'eras'} onChange={(e) => toggleEras(e.target.checked)} className="h-4 w-4 accent-lime" />
                  <span className="font-semibold">{MICROCOPY.eras}</span>
                </label>
                {form.mode === 'eras' && <ErasEditor form={form} errors={errors} update={update} />}

                <div>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" checked={form.caloriesEnabled} onChange={(e) => update({ caloriesEnabled: e.target.checked })} className="h-4 w-4 accent-lime" />
                    <span className="font-semibold">{MICROCOPY.calories}</span>
                  </label>
                  <p className="mt-1 text-xs text-muted">{MICROCOPY.caloriesHelp}</p>
                  {form.caloriesEnabled && (
                    <div className="mt-2 max-w-[12rem]">
                      <Field compact id="kcalPerMinute" label="Your guess" value={form.kcalPerMinute} onChange={(v) => update({ kcalPerMinute: v })} error={errors.kcalPerMinute} suffix="kcal / min" />
                    </div>
                  )}
                </div>

                <div className="max-w-[14rem]">
                  <Field compact id="offPerDay" label={MICROCOPY.lockedRate} value={form.offPerDay} onChange={(v) => update({ offPerDay: v })} error={errors.offPerDay} suffix="/ day" />
                </div>
              </div>
            </details>

            {warnings.map((w) => (
              <p key={w} className="text-sm text-manila">
                {w}
              </p>
            ))}
          </div>

          <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-ink/95 p-3 backdrop-blur md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
            <GhostButton onClick={onBack} className="shrink-0 text-sm md:text-base">
              <span className="md:hidden">Back</span>
              <span className="hidden md:inline">{MICROCOPY.receiptsBack}</span>
            </GhostButton>
            <PrimaryButton type="submit" className="flex-1 md:flex-none">
              {MICROCOPY.receiptsNext}
            </PrimaryButton>
          </div>
        </div>

        <div className="hidden justify-center md:flex">
          <ReactionMascot reaction={reaction} bubble={RECEIPT_BUBBLES[level]} bubbleSide="top" className="mt-16 h-72 w-72" />
        </div>
      </form>
    </section>
  )
}
