import { useCallback, useMemo, useState } from 'react'
import { AgeGate } from './components/AgeGate'
import { LoadingSequence } from './components/LoadingSequence'
import { ReceiptsModal } from './components/ReceiptsModal'
import { Results } from './components/Results'
import { SiteHeader } from './components/SiteHeader'
import { StepLore } from './components/StepLore'
import { StepReceipts } from './components/StepReceipts'
import { Stepper, type StepId } from './components/Stepper'
import { unlockedAchievements } from './lib/achievements'
import { calculateAudit } from './lib/calc'
import { hashString, pickCopy } from './lib/copy/select'
import { VERDICTS } from './lib/copy/verdicts'
import { fmtInt, fmtNum } from './lib/format'
import type { AuditInput, AuditResult } from './lib/types'
import { defaultForm, validateForm, type Errors, type FormState } from './lib/validate'

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

type Screen = 1 | 2 | 'loading' | 3
interface Audit {
  input: AuditInput
  result: AuditResult
  key: string
}

const focusFirstInvalid = () => requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())

export default function App() {
  const [ageOk, setAgeOk] = useState(readAgeOk)
  const [form, setForm] = useState<FormState>(defaultForm)
  const [screen, setScreen] = useState<Screen>(1)
  const [touched, setTouched] = useState<Set<string>>(() => new Set())
  const [attempted, setAttempted] = useState<{ 1: boolean; 2: boolean }>({ 1: false, 2: false })
  const [audit, setAudit] = useState<Audit | null>(null)
  const [reroll, setReroll] = useState(0)
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

  // Live validation; errors are shown once a field was touched or its step was submitted.
  const live = useMemo(() => validateForm(form), [form])
  const visible = (step: 1 | 2): Errors =>
    Object.fromEntries(
      Object.entries(live.errors).filter(([k]) => {
        const inStep = STEP1_KEYS.includes(k) === (step === 1)
        return inStep && (attempted[step] || touched.has(k))
      }),
    )

  const resultsFresh = audit !== null && audit.key === scienceKey(form)

  const nextFromLore = () => {
    setAttempted((a) => ({ ...a, 1: true }))
    if (STEP1_KEYS.some((k) => live.errors[k])) return focusFirstInvalid()
    setScreen(2)
    window.scrollTo({ top: 0 })
  }

  const runAudit = () => {
    setAttempted({ 1: true, 2: true })
    if (STEP1_KEYS.some((k) => live.errors[k])) {
      setScreen(1)
      return focusFirstInvalid()
    }
    if (!live.input) return focusFirstInvalid()
    try {
      const result = calculateAudit(live.input)
      setAudit({ input: live.input, result, key: scienceKey(form) })
      setReroll(0)
      setScreen('loading')
      window.scrollTo({ top: 0 })
    } catch {
      focusFirstInvalid()
    }
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
    setScreen(1)
  }

  const seed = audit ? hashString(JSON.stringify(audit.input)) : 0
  const copy = useMemo(() => {
    if (!audit) return null
    const r = audit.result
    return pickCopy(r.tier, form.heat, seed, seed + reroll * 7919, {
      sessions: fmtInt(r.sessions),
      hours: fmtInt(r.time.hours),
      years: fmtNum(r.years, 0),
    })
  }, [audit, form.heat, seed, reroll])

  if (!ageOk) return <AgeGate onConfirm={confirmAge} />

  const stepperCurrent: StepId = screen === 'loading' ? 3 : screen

  return (
    <div className="flex min-h-svh flex-col">
      <a href="#main" className="sr-only z-50 rounded bg-lime px-3 py-2 text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>
      <SiteHeader onInfo={() => setReceipts({ open: true, science: false })} />
      <div className="pt-3 pb-2 sm:pt-4">
        <Stepper current={stepperCurrent} done={resultsFresh && screen !== 'loading'} onGo={goStep} />
      </div>
      <main id="main" className="flex flex-1 flex-col overflow-x-clip">
        {screen === 1 && <StepLore form={form} errors={visible(1)} update={update} touch={touch} onNext={nextFromLore} />}
        {screen === 2 && (
          <StepReceipts form={form} errors={visible(2)} warnings={live.warnings} update={update} touch={touch} onBack={() => setScreen(1)} onNext={runAudit} />
        )}
        {screen === 'loading' && <LoadingSequence seed={seed} onDone={finishLoading} />}
        {screen === 3 && audit && copy && (
          <Results
            result={audit.result}
            verdict={VERDICTS[audit.result.tier]!}
            copy={copy}
            heat={form.heat}
            achievements={unlockedAchievements(audit.result, audit.input)}
            seed={seed}
            onHeat={(heat) => update({ heat })}
            onReroll={() => setReroll((n) => n + 1)}
            onEdit={() => setScreen(2)}
            onRestart={restart}
            onReceipts={() => setReceipts({ open: true, science: true })}
          />
        )}
      </main>
      <ReceiptsModal open={receipts.open} showScience={receipts.science} onClose={() => setReceipts({ open: false, science: false })} />
    </div>
  )
}
