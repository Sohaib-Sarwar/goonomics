import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { MICROCOPY } from '../lib/copy/lines'
import { fmtCount, fmtDuration, fmtInt } from '../lib/format'
import { DEFAULT_TIMELINE, TIMELINE_LIMITS, calorieLine, fictionalMeters, timelineItems, type TimelineAssumptions } from '../lib/timeline'
import type { AuditResult } from '../lib/types'
import { parseNumber } from '../lib/validate'
import { Field } from './Field'
import { PrimaryButton, Segmented, Sheet } from './ui'

const FIELDS: { key: keyof TimelineAssumptions; label: string; suffix: string }[] = [
  { key: 'pagesPerMinute', label: 'Reading speed', suffix: 'pages / min' },
  { key: 'pagesPerBook', label: 'Short book length', suffix: 'pages' },
  { key: 'lessonMinutes', label: 'Coding lesson length', suffix: 'min' },
  { key: 'pythonLessons', label: 'Python basics course', suffix: 'lessons' },
  { key: 'tutorialMinutes', label: 'Tutorial length', suffix: 'min' },
]

/** The alternate timeline: modeled time turned into imaginary achievements, with editable assumptions. */
export function Timeline({
  result,
  assumptions,
  setAssumptions,
  minutes,
  setMinutes,
}: {
  result: AuditResult
  assumptions: TimelineAssumptions
  setAssumptions: (a: TimelineAssumptions) => void
  minutes: string
  setMinutes: (m: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Record<keyof TimelineAssumptions, string>>(() => toDraft(assumptions))
  const items = timelineItems(result, assumptions)
  const meters = fictionalMeters(result)
  const kcal = calorieLine(result)

  const errors = Object.fromEntries(
    FIELDS.map(({ key }) => {
      const p = parseNumber(draft[key])
      const [min, max] = TIMELINE_LIMITS[key]
      return [key, !p.ok ? 'Numbers only.' : p.value < min || p.value > max ? `Between ${min} and ${max}.` : undefined]
    }),
  ) as Record<keyof TimelineAssumptions, string | undefined>
  const valid = Object.values(errors).every((e) => !e)

  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-[clamp(0.5rem,1.8vh,1rem)]">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-[clamp(1.7rem,min(7vw,5.5vh),3.2rem)] leading-[0.9] font-black text-balance uppercase">
            <span className="sm:hidden">{MICROCOPY.timelineShort}</span>
            <span className="hidden sm:inline">{MICROCOPY.timelineTitle}</span>
          </h2>
          <p className="mt-1 text-sm text-muted tiny:hidden">
            {fmtDuration(result.time.minutes)} of modeled time. {MICROCOPY.timelineSub}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDraft(toDraft(assumptions))
            setOpen(true)
          }}
          className="press inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-line-strong px-3 py-2 text-sm font-semibold hover:border-paper"
        >
          <SlidersHorizontal size={15} className="text-lime" aria-hidden />
          <span className="hidden sm:inline">{MICROCOPY.tweak}</span>
          <span className="sm:hidden">Assumptions</span>
        </button>
      </div>

      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {items.map((it) => (
          <li key={it.id} className="min-w-0 rounded-xl border border-line bg-panel/80 px-3 py-[clamp(0.4rem,1.4vh,0.9rem)]">
            <p className="tabular truncate font-mono text-[clamp(1.4rem,4.4vh,2.4rem)] leading-none font-medium text-lime">{fmtCount(it.count)}</p>
            <p className="mt-1 text-sm leading-tight font-semibold text-pretty tiny:text-xs">{it.label}</p>
            <p className="mt-0.5 text-[0.7rem] leading-tight text-faint short:hidden">{it.basis}</p>
          </li>
        ))}
      </ul>

      <p className="rounded-xl border border-dashed border-line-strong px-3 py-2 text-sm text-pretty tiny:py-1.5 tiny:text-xs">
        <span className="font-semibold">{MICROCOPY.scientist}</span> <span className="text-muted">({fmtInt(result.time.hours)} lab hours on paper.)</span>
      </p>

      <div className="rounded-xl bg-ink/70 px-3 py-2">
        <p className="flex items-center gap-2 text-xs text-muted">
          Meters nobody asked for
          <span className="rounded border border-coral/60 px-1 font-mono text-[0.6rem] text-coral">{MICROCOPY.fictional}</span>
        </p>
        <dl className="mt-1 grid grid-cols-3 gap-2">
          {[
            ['Brainrot XP', meters.brainrotXP],
            ['Lock in potential', meters.lockInPotential],
            ['Productivity points', meters.productivityPoints],
          ].map(([label, n]) => (
            <div key={label as string} className="min-w-0">
              <dt className="text-[0.7rem] leading-tight text-muted">{label}</dt>
              <dd className="tabular font-mono text-base leading-tight sm:text-xl">{fmtInt(n as number)}</dd>
            </div>
          ))}
        </dl>
      </div>
      {kcal && <p className="text-xs text-manila">{kcal}</p>}

      <Sheet open={open} onClose={() => setOpen(false)} title={MICROCOPY.tweak}>
        <div className="space-y-4">
          <Segmented
            label="Average session length (updates the whole audit)"
            size="sm"
            value={['5', '10', '15', '30'].includes(minutes) ? minutes : '15'}
            options={['5', '10', '15', '30'].map((m) => ({ value: m, label: `${m} min` }))}
            onChange={setMinutes}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <Field key={f.key} compact id={`tl-${f.key}`} label={f.label} value={draft[f.key]} onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} error={errors[f.key]} suffix={f.suffix} />
            ))}
          </div>
          <p className="text-xs text-muted">0.8 pages a minute is about 238 words a minute, the average adult reading speed (Brysbaert 2019), at roughly 300 words a page.</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setDraft(toDraft(DEFAULT_TIMELINE))} className="press rounded-xl border border-line-strong px-4 py-3 text-sm font-semibold hover:border-paper">
              Reset
            </button>
            <PrimaryButton
              className="flex-1"
              onClick={() => {
                if (!valid) return
                setAssumptions(Object.fromEntries(FIELDS.map(({ key }) => [key, Number(draft[key].replace(',', '.'))])) as unknown as TimelineAssumptions)
                setOpen(false)
              }}
            >
              Apply
            </PrimaryButton>
          </div>
        </div>
      </Sheet>
    </div>
  )
}

function toDraft(a: TimelineAssumptions): Record<keyof TimelineAssumptions, string> {
  return Object.fromEntries(Object.entries(a).map(([k, v]) => [k, String(v)])) as Record<keyof TimelineAssumptions, string>
}
