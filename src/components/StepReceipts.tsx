import { Settings2 } from 'lucide-react'
import { useState } from 'react'
import { SPERM_MILLIONS, VOLUME_ML, type OutputPresetId } from '../lib/assumptions'
import { MICROCOPY } from '../lib/copy/lines'
import { liveComment, type LiveField } from '../lib/copy/live'
import { HEAT_LABELS, type Heat } from '../lib/copy/roasts'
import type { Reaction } from '../lib/copy/verdicts'
import { parseNumber, suggestEras, type Errors, type FormState } from '../lib/validate'
import { ErasEditor } from './AdvancedSettings'
import { Field } from './Field'
import { LiveCommentary } from './LiveCommentary'
import { ErrorText, GhostButton, PrimaryButton, Segmented, Sheet, SliderField, StepFrame } from './ui'

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
  { value: 'median', label: `WHO ${VOLUME_ML.median.value} mL` },
  { value: 'custom', label: 'Custom' },
]

const NERD_KEYS = ['minutesPerSession', 'customMl', 'customSpermMillions', 'kcalPerMinute', 'offPerDay', 'eras']

export function StepReceipts({ form, errors, warnings, update, touch, onBack, onNext }: Props) {
  const [active, setActive] = useState<LiveField>('normalPerDay')
  const [nerd, setNerd] = useState(false)
  const peakDays = parseNumber(form.peakDaysPerYear)
  const showPeakRate = form.mode === 'simple' && peakDays.ok && peakDays.value > 0
  const nerdErrors = NERD_KEYS.some((k) => errors[k]) || Object.keys(errors).some((k) => k.startsWith('eras.'))

  const valueOf: Record<LiveField, string> = {
    currentAge: form.currentAge,
    startAge: form.startAge,
    normalPerDay: form.normalPerDay,
    peakDaysPerYear: form.peakDaysPerYear,
    peakPerDay: form.peakPerDay,
    offDaysPerYear: form.offDaysPerYear,
    heat: form.heat,
    minutes: form.minutesPerSession,
  }
  const comment = liveComment(active, valueOf[active], { heat: form.heat })
  const daily = parseNumber(form.normalPerDay)
  const reaction: Reaction =
    Object.keys(errors).length > 0 ? 'stare' : !daily.ok ? 'auditor' : daily.value === 0 ? 'stare' : daily.value < 0.75 ? 'paper' : daily.value < 2 ? 'inspect' : daily.value < 6 ? 'sweat' : 'cry'

  const on = (field: LiveField, patch: Partial<FormState>) => {
    setActive(field)
    update(patch)
  }

  const toggleEras = (onOff: boolean) => {
    if (!onOff) return update({ mode: 'simple' })
    const s = parseNumber(form.startAge)
    const c = parseNumber(form.currentAge)
    update({ mode: 'eras', eras: form.eras.length ? form.eras : s.ok && c.ok && c.value > s.value ? suggestEras(s.value, c.value) : [] })
  }

  return (
    <form
      noValidate
      className="h-full"
      onSubmit={(e) => {
        e.preventDefault()
        onNext()
      }}
    >
      <StepFrame
        actions={
          <>
            <GhostButton onClick={onBack} className="shrink-0 text-sm sm:text-base" label={MICROCOPY.receiptsBack}>
              <span aria-hidden className="sm:hidden">
                Back
              </span>
              <span aria-hidden className="hidden sm:inline">
                {MICROCOPY.receiptsBack}
              </span>
            </GhostButton>
            <button
              type="button"
              onClick={() => setNerd(true)}
              aria-label={nerdErrors ? `${MICROCOPY.nerdSettings}, has errors` : MICROCOPY.nerdSettings}
              className={`press inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold ${nerdErrors ? 'border-coral text-coral' : 'border-line-strong hover:border-paper'}`}
            >
              <Settings2 size={17} className={nerdErrors ? '' : 'text-lime'} aria-hidden />
              <span aria-hidden className="hidden lg:inline">
                {MICROCOPY.nerdSettings}
              </span>
            </button>
            <PrimaryButton type="submit" className="flex-1 md:flex-none">
              {MICROCOPY.receiptsNext}
            </PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 items-center gap-[clamp(0.5rem,2vh,2rem)] md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.7fr)]">
          <div className="min-w-0 space-y-[clamp(0.5rem,1.8vh,1.1rem)]">
            <div>
              <h1 className="font-display text-[clamp(1.8rem,min(8vw,6.2vh),3.9rem)] leading-[0.88] font-black uppercase">{MICROCOPY.receiptsTitle}</h1>
              <p className="mt-1 text-sm text-paper/80 sm:text-base short:hidden">{MICROCOPY.receiptsSub}</p>
            </div>
            <LiveCommentary comment={comment} reaction={reaction} layout="row" />

            {form.mode === 'simple' ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-[clamp(0.35rem,1.4vh,0.9rem)] min-[520px]:grid-cols-2">
                <SliderField
                  id="normalPerDay"
                  label={MICROCOPY.daily}
                  hint={MICROCOPY.dailyHint}
                  value={form.normalPerDay}
                  onChange={(v) => on('normalPerDay', { normalPerDay: v })}
                  onFocus={() => setActive('normalPerDay')}
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
                  onChange={(v) => on('peakDaysPerYear', { peakDaysPerYear: v })}
                  onFocus={() => setActive('peakDaysPerYear')}
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
                    onChange={(v) => on('peakPerDay', { peakPerDay: v })}
                    onFocus={() => setActive('peakPerDay')}
                    onBlur={() => touch('peakPerDay')}
                    min={0}
                    max={17}
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
                  onChange={(v) => on('offDaysPerYear', { offDaysPerYear: v })}
                  onFocus={() => setActive('offDaysPerYear')}
                  onBlur={() => touch('offDaysPerYear')}
                  min={0}
                  max={365}
                  step={1}
                  unit="days"
                  error={errors.offDaysPerYear}
                />
              </div>
            ) : (
              <p className="rounded-xl border border-lime/40 bg-lime/5 px-4 py-2.5 text-sm">Eras mode is on. Your eras live in Nerd settings.</p>
            )}

            <Segmented label={MICROCOPY.heat} hint={MICROCOPY.heatHint} value={form.heat} options={HEATS} onChange={(heat) => on('heat', { heat })} />
            {warnings.map((w) => (
              <p key={w} className="text-sm text-manila">
                {w}
              </p>
            ))}
          </div>
          <LiveCommentary comment={comment} reaction={reaction} layout="stack" />
        </div>
      </StepFrame>

      <Sheet open={nerd} onClose={() => setNerd(false)} title={MICROCOPY.nerdSettings}>
        <div className="space-y-5">
          <Segmented
            label={MICROCOPY.sessionLength}
            size="sm"
            value={['5', '10', '15', '30'].includes(form.minutesPerSession) ? form.minutesPerSession : '15'}
            options={['5', '10', '15', '30'].map((m) => ({ value: m, label: `${m} min` }))}
            onChange={(m) => on('minutes', { minutesPerSession: m })}
          />
          {errors.minutesPerSession && <ErrorText error={errors.minutesPerSession} />}

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

          <div className="max-w-[16rem]">
            <Field compact id="offPerDay" label={MICROCOPY.lockedRate} value={form.offPerDay} onChange={(v) => update({ offPerDay: v })} error={errors.offPerDay} suffix="/ day" />
          </div>

          <PrimaryButton onClick={() => setNerd(false)} className="w-full">
            {MICROCOPY.done}
          </PrimaryButton>
        </div>
      </Sheet>
    </form>
  )
}
