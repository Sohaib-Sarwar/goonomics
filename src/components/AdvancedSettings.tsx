import { Plus, Trash2, Wand2 } from 'lucide-react'
import { MICROCOPY } from '../lib/copy/lines'
import { LIMITS, newEra, parseNumber, suggestEras, type EraForm, type Errors, type FormState } from '../lib/validate'
import { Field } from './Field'

interface Props {
  form: FormState
  errors: Errors
  update: (patch: Partial<FormState>) => void
}

/** Optional historical periods ("eras"), each with its own rates. Overlaps are rejected on submit. */
export function AdvancedSettings({ form, errors, update }: Props) {
  const setEra = (id: string, patch: Partial<EraForm>) =>
    update({ eras: form.eras.map((e) => (e.id === id ? { ...e, ...patch } : e)) })

  const start = parseNumber(form.startAge)
  const current = parseNumber(form.currentAge)
  const canSuggest = start.ok && current.ok && current.value > start.value

  const addEra = () => {
    const last = form.eras.at(-1)
    const from = last?.toAge ?? form.startAge
    update({ eras: [...form.eras, newEra('', from, form.currentAge)] })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{MICROCOPY.erasHelp} {MICROCOPY.erasGap}</p>

      {errors.eras && <p className="text-sm text-coral">{errors.eras}</p>}

      <ol className="space-y-3">
        {form.eras.map((era, index) => {
          const p = `eras.${era.id}.`
          const err = (k: string) => errors[`${p}${k}`]
          return (
            <li key={era.id} className="border border-line bg-panel/80">
              <div className="flex items-center gap-3 border-b border-line px-3 py-2">
                <span className="font-mono text-xs text-faint">Ch. {index + 1}</span>
                <label htmlFor={`${era.id}-label`} className="sr-only">
                  Era name
                </label>
                <input
                  id={`${era.id}-label`}
                  value={era.label}
                  maxLength={LIMITS.maxLabel}
                  onChange={(e) => setEra(era.id, { label: e.target.value })}
                  placeholder="Name this era"
                  aria-invalid={err('label') ? true : undefined}
                  className="min-w-0 flex-1 bg-transparent py-1 font-display text-lg font-bold tracking-wide uppercase placeholder:text-faint focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => update({ eras: form.eras.filter((e) => e.id !== era.id) })}
                  className="p-1.5 text-muted hover:text-coral"
                  aria-label={`${MICROCOPY.removeEra}: ${era.label || `chapter ${index + 1}`}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {err('label') && <p className="px-3 pt-2 text-sm text-coral">{err('label')}</p>}
              <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 lg:grid-cols-6">
                <Field compact id={`${era.id}-from`} label="From age" value={era.fromAge} inputMode="numeric" onChange={(v) => setEra(era.id, { fromAge: v })} error={err('fromAge')} />
                <Field compact id={`${era.id}-to`} label="To age" value={era.toAge} inputMode="numeric" onChange={(v) => setEra(era.id, { toAge: v })} error={err('toAge')} />
                <Field compact id={`${era.id}-normal`} label="Regular / day" value={era.normalPerDay} onChange={(v) => setEra(era.id, { normalPerDay: v })} error={err('normalPerDay')} placeholder="1" />
                <Field compact id={`${era.id}-peak`} label="Peak / day" value={era.peakPerDay} onChange={(v) => setEra(era.id, { peakPerDay: v })} error={err('peakPerDay')} placeholder="same" />
                <Field compact id={`${era.id}-peakdays`} label="Peak days / yr" value={era.peakDaysPerYear} inputMode="numeric" onChange={(v) => setEra(era.id, { peakDaysPerYear: v })} error={err('peakDaysPerYear')} />
                <Field compact id={`${era.id}-offdays`} label="Off days / yr" value={era.offDaysPerYear} inputMode="numeric" onChange={(v) => setEra(era.id, { offDaysPerYear: v })} error={err('offDaysPerYear')} />
              </div>
            </li>
          )
        })}
      </ol>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addEra}
          disabled={form.eras.length >= LIMITS.maxEras}
          className="inline-flex items-center gap-2 border border-line-strong px-3.5 py-2 text-sm hover:border-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={16} /> {MICROCOPY.addEra}
        </button>
        <button
          type="button"
          onClick={() => canSuggest && update({ eras: suggestEras(start.value, current.value) })}
          disabled={!canSuggest}
          title={canSuggest ? undefined : 'Fill in both ages first'}
          className="inline-flex items-center gap-2 border border-line-strong px-3.5 py-2 text-sm hover:border-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Wand2 size={16} /> Split my ages into eras
        </button>
      </div>
    </div>
  )
}
