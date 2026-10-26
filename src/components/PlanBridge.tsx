import { ArrowRight, Leaf } from 'lucide-react'
import { useState } from 'react'
import { MICROCOPY } from '../lib/copy/lines'
import { ageToRange, tarnLink } from '../lib/tarn'
import { PrimaryButton, Sheet } from './ui'

/**
 * The opt in path from the calculator to Tarn. Nothing moves unless the person ticks it, and only
 * an age range and the GOI (as a note) can move, inside the link's fragment. The GOI never sets a
 * goal or a severity in Tarn.
 */
export function PlanBridge({ age, goi }: { age: number; goi: number }) {
  const [open, setOpen] = useState(false)
  const [bringAge, setBringAge] = useState(true)
  const [bringGoi, setBringGoi] = useState(false)
  const go = (share: boolean) => {
    const agreed = share && (bringAge || bringGoi)
    window.location.assign(tarnLink(agreed ? { ageRange: bringAge ? ageToRange(age) : null, goi: bringGoi ? goi : null } : null))
  }
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="press flex w-full items-center gap-2.5 rounded-xl border border-line px-3 py-2 text-left text-sm hover:border-lime/60"
      >
        <Leaf size={16} className="shrink-0 text-lime" aria-hidden />
        <span className="min-w-0 flex-1 text-muted tiny:hidden">{MICROCOPY.planPrompt}</span>
        <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-paper">
          {MICROCOPY.planCta} <ArrowRight size={14} aria-hidden />
        </span>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={MICROCOPY.planTitle}>
        <p className="text-paper/90">{MICROCOPY.planBody}</p>
        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-3 rounded-xl border border-line px-3 py-3">
            <input type="checkbox" checked={bringAge} onChange={(e) => setBringAge(e.target.checked)} className="size-5 accent-lime" />
            <span>{MICROCOPY.planAge}</span>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-line px-3 py-3">
            <input type="checkbox" checked={bringGoi} onChange={(e) => setBringGoi(e.target.checked)} className="size-5 accent-lime" />
            <span>{MICROCOPY.planGoi}</span>
          </label>
        </div>
        <p className="mt-3 text-sm text-muted">{MICROCOPY.planPrivacy}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <PrimaryButton onClick={() => go(true)}>{MICROCOPY.planGo}</PrimaryButton>
          <button type="button" onClick={() => go(false)} className="press rounded-xl px-3 py-2.5 text-sm font-semibold text-muted hover:text-paper">
            {MICROCOPY.planFresh}
          </button>
        </div>
      </Sheet>
    </>
  )
}
