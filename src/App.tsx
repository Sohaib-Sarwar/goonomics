import { Suspense, lazy, useCallback, useMemo, useState } from 'react'
import { AgeGate } from './components/AgeGate'
import { Landing } from './components/Landing'
import { LoadingSequence } from './components/LoadingSequence'
import { ReceiptsModal } from './components/ReceiptsModal'
import { SiteHeader } from './components/SiteHeader'
import { StepLore } from './components/StepLore'
import { StepReceipts } from './components/StepReceipts'
import { Stepper, type StepId } from './components/Stepper'
import { unlockedAchievements } from './lib/achievements'
import { calculateAudit } from './lib/calc'
import { RECOMMENDED_FIELDS, type CardField } from './lib/card'
import { hashString, pickCopy } from './lib/copy/select'
import { VERDICTS } from './lib/copy/verdicts'
import { fmtInt, fmtNum } from './lib/format'
import { DEFAULT_TIMELINE, type TimelineAssumptions } from './lib/timeline'
import type { AuditInput, AuditResult } from './lib/types'
import { defaultForm, validateForm, type Errors, type FormState } from './lib/validate'

// The results screen (panels, card studio, image export) loads while the audit animation plays.
const Results = lazy(() => import('./components/Results').then((m) => ({ default: m.Results })))

const AGE_KEY = 'goonomics:age-ok'
const STEP1_KEYS = ['currentAge', 'startAge']

function readAgeOk(): boolean {
  try {
    return sessionStorage.getItem(AGE_KEY) === '1'
  } catch {
    return false
  }
}

/** Science inputs only: roast heat is excluded so it can never change a number or a seed. */
const scienceKey = (f: FormState) => JSON.stringify({ ...f, heat: undefined })

type Screen = 'landing' | 1 | 2 | 'loading' | 3
interface Audit {
  input: AuditInput
  result: AuditResult
  key: string
}

const focusFirstInvalid = () => requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())

export default function App() {
  const [ageOk, setAgeOk] = useState(readAgeOk)
  const [form, setForm] = useState<FormState>(defaultForm)
  const [screen, setScreen] = useState<Screen>('landing')
  const [touched, setTouched] = useState<Set<string>>(() => new Set())
  const [attempted, setAttempted] = useState<{ 1: boolean; 2: boolean }>({ 1: false, 2: false })
  const [audit, setAudit] = useState<Audit | null>(null)
  const [reroll, setReroll] = useState(0)
  const [fields, setFields] = useState<CardField[]>(RECOMMENDED_FIELDS)
  const [timeline, setTimeline] = useState<TimelineAssumptions>(DEFAULT_TIMELINE)
  const [receipts, setReceipts] = useState<{ open: boolean; science: boolean }>({ open: false, science: false })

  const confirmAge = () => {
    try {
      sessionStorage.setItem(AGE_KEY, '1')
    } catch {
      // Storage blocked: the gate shows again next visit.
    }
    setAgeOk(true)
  }

  const update = useCallback((patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch })), [])
  const touch = useCallback((key: string) => setTouched((t) => (t.has(key) ? t : new Set(t).add(key))), [])

  // Live validation; errors show once a field was touched or its step was submitted.
  const live = useMemo(() => validateForm(form), [form])
  const visible = (step: 1 | 2): Errors =>
    Object.fromEntries(
      Object.entries(live.errors).filter(([k]) => {
        const inStep = STEP1_KEYS.includes(k) === (step === 1)
        // Over the limit or obviously wrong values show immediately while typing.
        const typed = k in form && (form as unknown as Record<string, unknown>)[k] !== '' && (form as unknown as Record<string, unknown>)[k] !== defaultForm()[k as keyof FormState]
        return inStep && (attempted[step] || touched.has(k) || (step === 2 && typed))
      }),
    )

  const resultsFresh = audit !== null && audit.key === scienceKey(form)

  const nextFromLore = () => {
    setAttempted((a) => ({ ...a, 1: true }))
    if (STEP1_KEYS.some((k) => live.errors[k])) return focusFirstInvalid()
    setScreen(2)
  }

  const compute = (f: FormState) => {
    const v = validateForm(f)
    if (!v.input) return null
    return { input: v.input, result: calculateAudit(v.input), key: scienceKey(f) }
  }

  const runAudit = () => {
    setAttempted({ 1: true, 2: true })
    if (STEP1_KEYS.some((k) => live.errors[k])) {
      setScreen(1)
      return focusFirstInvalid()
    }
    try {
      const next = compute(form)
      if (!next) return focusFirstInvalid()
      setAudit(next)
      setReroll(0)
      setScreen('loading')
    } catch {
      focusFirstInvalid()
    }
  }

  /** Session length can change on the results screen; the audit re-runs instantly. */
  const setMinutes = (m: string) => {
    const f = { ...form, minutesPerSession: m }
    setForm(f)
    const next = compute(f)
    if (next) setAudit(next)
  }

  const finishLoading = useCallback(() => setScreen(3), [])

  const goStep = (step: StepId) => {
    if (step === 3) {
      if (resultsFresh) setScreen(3)
      else runAudit()
      return
    }
    setScreen(step)
  }

  const restart = () => {
    setForm(defaultForm())
    setTouched(new Set())
    setAttempted({ 1: false, 2: false })
    setAudit(null)
    setFields(RECOMMENDED_FIELDS)
    setScreen(1)
  }

  const seed = audit ? hashString(JSON.stringify({ ...audit.input, minutesPerSession: 0 })) : 0
  const copy = useMemo(() => {
    if (!audit) return null
    const r = audit.result
    return pickCopy(r.tier, form.heat, seed, seed + reroll * 7919, {
      sessions: fmtInt(r.sessions),
      hours: fmtInt(r.time.hours),
      years: fmtNum(r.years, 0),
    })
  }, [audit, form.heat, seed, reroll])


  // The results page has its own tabs, so the step progress bar only shows while the audit is being filled in.
  const stepperCurrent: StepId | null = screen === 'landing' || screen === 3 ? null : screen === 'loading' ? 3 : screen

  return (
    <>
    {/* The landing renders under the age gate so crawlers and the first paint see real content; it stays inert until confirmed. */}
    <div className="flex h-dvh flex-col overflow-hidden" inert={!ageOk} aria-hidden={!ageOk || undefined}>
      <a href="#main" className="sr-only z-50 rounded bg-lime px-3 py-2 text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>
      <SiteHeader onInfo={() => setReceipts({ open: true, science: false })} onHome={() => setScreen('landing')} />
      {stepperCurrent !== null && (
        <div className="shrink-0 pt-2 pb-1 tiny:pt-1">
          <Stepper current={stepperCurrent} done={resultsFresh && screen !== 'loading'} onGo={goStep} />
        </div>
      )}
      <main id="main" className="relative min-h-0 flex-1 overflow-hidden">
        {screen === 'landing' && <Landing onStart={() => setScreen(1)} />}
        {screen === 1 && <StepLore form={form} errors={visible(1)} update={update} touch={touch} onNext={nextFromLore} />}
        {screen === 2 && <StepReceipts form={form} errors={visible(2)} warnings={live.warnings} update={update} touch={touch} onBack={() => setScreen(1)} onNext={runAudit} />}
        {screen === 'loading' && <LoadingSequence seed={seed} onDone={finishLoading} />}
        {screen === 'loading' && <PrefetchResults />}
        {screen === 3 && audit && copy && (
          <Suspense fallback={<LoadingSequence seed={seed} onDone={() => undefined} />}>
          <Results
            result={audit.result}
            verdict={VERDICTS[audit.result.tier]!}
            copy={copy}
            heat={form.heat}
            achievements={unlockedAchievements(audit.result, audit.input)}
            seed={seed}
            fields={fields}
            setFields={setFields}
            timeline={timeline}
            setTimeline={setTimeline}
            minutes={form.minutesPerSession}
            setMinutes={setMinutes}
            onHeat={(heat) => update({ heat })}
            onReroll={() => setReroll((n) => n + 1)}
            onEdit={() => setScreen(2)}
            onRestart={restart}
            onReceipts={() => setReceipts({ open: true, science: true })}
          />
          </Suspense>
        )}
      </main>
      <ReceiptsModal open={receipts.open} showScience={receipts.science} onClose={() => setReceipts({ open: false, science: false })} />
    </div>
    {!ageOk && <AgeGate onConfirm={confirmAge} />}
    </>
  )
}

/** Starts downloading the results chunk as soon as the audit animation begins. */
function PrefetchResults() {
  void import('./components/Results')
  return null
}
