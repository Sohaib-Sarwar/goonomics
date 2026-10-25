import { useCallback, useMemo, useState } from 'react'
import { AgeGate } from './components/AgeGate'
import { GoonCalculatorForm } from './components/GoonCalculatorForm'
import { LandingHero } from './components/LandingHero'
import { LoadingSequence } from './components/LoadingSequence'
import { Methodology } from './components/Methodology'
import { PrivacyNotice } from './components/PrivacyNotice'
import { ResultsDashboard } from './components/ResultsDashboard'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { calculateAudit } from './lib/calc'
import { hashString, pickCopy } from './lib/copy/select'
import { VERDICTS } from './lib/copy/verdicts'
import { fmtInt, fmtNum } from './lib/format'
import type { AuditInput, AuditResult } from './lib/types'
import { defaultForm, validateForm, type Errors, type FormState } from './lib/validate'

const AGE_KEY = 'goonomics:age-ok'

function readAgeOk(): boolean {
  try {
    return sessionStorage.getItem(AGE_KEY) === '1'
  } catch {
    return false
  }
}

type Stage = { name: 'form' } | { name: 'loading'; input: AuditInput; result: AuditResult } | { name: 'results'; input: AuditInput; result: AuditResult }

export default function App() {
  const [ageOk, setAgeOk] = useState(readAgeOk)
  const [form, setForm] = useState<FormState>(defaultForm)
  const [errors, setErrors] = useState<Errors>({})
  const [warnings, setWarnings] = useState<string[]>([])
  const [stage, setStage] = useState<Stage>({ name: 'form' })
  const [reroll, setReroll] = useState(0)

  const confirmAge = () => {
    try {
      sessionStorage.setItem(AGE_KEY, '1')
    } catch {
      // Storage blocked: the gate simply shows again next visit.
    }
    setAgeOk(true)
  }

  const update = useCallback((patch: Partial<FormState>) => {
    setForm((f) => ({ ...f, ...patch }))
  }, [])

  const scrollToAudit = () => document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const submit = () => {
    const v = validateForm(form)
    setErrors(v.errors)
    setWarnings(v.warnings)
    if (!v.input) return
    let result: AuditResult
    try {
      result = calculateAudit(v.input)
    } catch (e) {
      setErrors({ eras: e instanceof Error ? e.message : 'The audit could not run with these values.' })
      return
    }
    setReroll(0)
    setStage({ name: 'loading', input: v.input, result })
    window.scrollTo({ top: 0 })
  }

  const finishLoading = useCallback(() => {
    setStage((s) => (s.name === 'loading' ? { name: 'results', input: s.input, result: s.result } : s))
  }, [])

  const seed = useMemo(() => (stage.name === 'form' ? 0 : hashString(JSON.stringify(stage.input))), [stage])

  const copy = useMemo(() => {
    if (stage.name !== 'results') return null
    const r = stage.result
    return pickCopy(r.tier, seed + reroll * 7919, {
      sessions: fmtInt(r.sessions),
      hours: fmtInt(r.time.hours),
      years: fmtNum(r.years, 0),
      verdict: VERDICTS[r.tier]!.name,
    })
  }, [stage, seed, reroll])

  const backToForm = (reset: boolean) => {
    if (reset) {
      setForm(defaultForm())
      setErrors({})
      setWarnings([])
    }
    setStage({ name: 'form' })
    requestAnimationFrame(() => scrollToAudit())
  }

  if (!ageOk) return <AgeGate onConfirm={confirmAge} />

  return (
    <>
      <a href="#main" className="sr-only z-50 bg-lime px-3 py-2 text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        {stage.name === 'form' && (
          <>
            <LandingHero onStart={scrollToAudit} />
            <GoonCalculatorForm form={form} errors={errors} warnings={warnings} update={update} onSubmit={submit} />
          </>
        )}
        {stage.name === 'loading' && <LoadingSequence seed={seed} onDone={finishLoading} />}
        {stage.name === 'results' && copy && (
          <ResultsDashboard
            result={stage.result}
            verdict={VERDICTS[stage.result.tier]!}
            copy={copy}
            seed={seed}
            onReroll={() => setReroll((n) => n + 1)}
            onEdit={() => backToForm(false)}
            onRestart={() => backToForm(true)}
          />
        )}
        <Methodology />
        <PrivacyNotice />
      </main>
      <SiteFooter />
    </>
  )
}
