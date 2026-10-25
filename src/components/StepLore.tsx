import { useState } from 'react'
import { MICROCOPY } from '../lib/copy/lines'
import { liveComment, type LiveField } from '../lib/copy/live'
import { LIMITS, parseNumber, type Errors, type FormState } from '../lib/validate'
import { LiveCommentary } from './LiveCommentary'
import { BigNumber, PrimaryButton, StepFrame } from './ui'

interface Props {
  form: FormState
  errors: Errors
  update: (patch: Partial<FormState>) => void
  touch: (key: string) => void
  onNext: () => void
}

export function StepLore({ form, errors, update, touch, onNext }: Props) {
  const [active, setActive] = useState<LiveField>('currentAge')
  const comment = liveComment(active, active === 'currentAge' ? form.currentAge : form.startAge, { currentAge: form.currentAge })
  const cur = parseNumber(form.currentAge)
  const start = parseNumber(form.startAge)
  const years = cur.ok && start.ok ? cur.value - start.value : 0
  const reaction = errors.currentAge || errors.startAge ? 'stare' : years >= 25 ? 'cry' : years >= 12 ? 'inspect' : 'auditor'

  const set = (field: 'currentAge' | 'startAge', v: string) => {
    setActive(field)
    update({ [field]: v })
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
          <PrimaryButton type="submit" className="w-full md:w-auto">
            {MICROCOPY.loreNext}
          </PrimaryButton>
        }
      >
        <div className="grid grid-cols-1 items-center gap-[clamp(0.75rem,2.5vh,2rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)]">
          <div className="min-w-0 space-y-[clamp(0.75rem,2.5vh,1.5rem)]">
            <div>
              <h1 className="font-display text-[clamp(2.2rem,min(9vw,8vh),5rem)] leading-[0.88] font-black text-balance uppercase">{MICROCOPY.loreTitle}</h1>
              <p className="mt-2 text-[clamp(0.95rem,2.2vh,1.2rem)] text-paper/85">{MICROCOPY.loreSub}</p>
            </div>
            <LiveCommentary comment={comment} reaction={reaction} layout="row" />
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-5">
              <BigNumber
                id="currentAge"
                label={MICROCOPY.currentAge}
                hint={MICROCOPY.currentAgeHint}
                value={form.currentAge}
                onChange={(v) => set('currentAge', v)}
                onFocus={() => setActive('currentAge')}
                onBlur={() => touch('currentAge')}
                min={LIMITS.minAge}
                max={LIMITS.maxAge}
                placeholder="24"
                error={errors.currentAge}
              />
              <BigNumber
                id="startAge"
                label={MICROCOPY.startAge}
                hint={MICROCOPY.startAgeHint}
                value={form.startAge}
                onChange={(v) => set('startAge', v)}
                onFocus={() => setActive('startAge')}
                onBlur={() => touch('startAge')}
                min={LIMITS.minStartAge}
                max={LIMITS.maxAge}
                placeholder="14"
                error={errors.startAge}
              />
            </div>
          </div>
          <LiveCommentary comment={comment} reaction={reaction} layout="stack" />
        </div>
      </StepFrame>
    </form>
  )
}
