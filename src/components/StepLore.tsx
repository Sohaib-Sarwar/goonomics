import type { FormEvent } from 'react'
import { ASSETS } from '../lib/assets'
import { LORE_BUBBLES, MICROCOPY } from '../lib/copy/lines'
import { fill } from '../lib/copy/select'
import { LIMITS, parseNumber, type Errors, type FormState } from '../lib/validate'
import { ReactionMascot } from './Mascot'
import { BigNumber, PrimaryButton } from './ui'

interface Props {
  form: FormState
  errors: Errors
  update: (patch: Partial<FormState>) => void
  touch: (key: string) => void
  onNext: () => void
}

export function StepLore({ form, errors, update, touch, onNext }: Props) {
  const cur = parseNumber(form.currentAge)
  const start = parseNumber(form.startAge)
  const years = cur.ok && start.ok && cur.value >= start.value ? Math.round(cur.value - start.value) : null
  const bubble =
    years === null
      ? LORE_BUBBLES.empty
      : years === 0
        ? LORE_BUBBLES.zero
        : years < 5
          ? LORE_BUBBLES.short
          : fill(years < 15 ? LORE_BUBBLES.medium : LORE_BUBBLES.long, { years: String(years) })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <section aria-labelledby="lore-title" className="relative isolate flex flex-1 flex-col">
      <img
        src={ASSETS.hero.src}
        srcSet={ASSETS.hero.srcSet}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[75%_center] opacity-35"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0c0c0f_15%,#0c0c0fcc_55%,#0c0c0f66_100%)]" />

      <form noValidate onSubmit={submit} className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-6 px-4 pb-28 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:pb-8">
        <div className="max-w-xl">
          <h1 id="lore-title" className="font-display text-[clamp(2.7rem,8vw,5.4rem)] leading-[0.88] font-black tracking-[-0.01em] uppercase">
            {MICROCOPY.loreTitle}
          </h1>
          <p className="mt-3 text-lg text-paper/85 sm:text-xl">{MICROCOPY.loreSub}</p>

          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <BigNumber
              id="currentAge"
              label={MICROCOPY.currentAge}
              hint={MICROCOPY.currentAgeHint}
              value={form.currentAge}
              onChange={(v) => update({ currentAge: v })}
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
              onChange={(v) => update({ startAge: v })}
              onBlur={() => touch('startAge')}
              min={LIMITS.minStartAge}
              max={LIMITS.maxAge}
              placeholder="14"
              error={errors.startAge}
            />
          </div>
          <p className="mt-4 text-sm text-muted">{MICROCOPY.loreHelp}</p>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/95 p-3 backdrop-blur md:static md:mt-7 md:border-0 md:bg-transparent md:p-0">
            <PrimaryButton type="submit" className="w-full md:w-auto">
              {MICROCOPY.loreNext}
            </PrimaryButton>
          </div>
        </div>

        <div className="order-first flex justify-end md:order-none md:justify-center">
          <ReactionMascot
            reaction={years !== null && years >= 15 ? 'sweat' : 'audit'}
            bubble={bubble}
            className="mr-2 h-32 w-32 sm:h-40 sm:w-40 md:mr-0 md:h-80 md:w-80"
          />
        </div>
      </form>
    </section>
  )
}
