import { useEffect, useRef, useState } from 'react'
import { MICROCOPY } from '../lib/copy/lines'
import { ReactionMascot } from './Mascot'
import { Wordmark } from './Wordmark'

/**
 * A simple self declaration screen, not identity verification. The answer lives in
 * sessionStorage for this tab only (if storage is available at all).
 */
export function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const [declined, setDeclined] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => headingRef.current?.focus(), [declined])

  return (
    <div className="grid-paper fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink px-4 py-8">
      <div role="dialog" aria-modal="true" aria-labelledby="age-title" className="w-full max-w-md overflow-hidden rounded-3xl border border-line bg-panel">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <Wordmark size="sm" />
          <span className="rounded-full border border-coral/60 px-2.5 py-0.5 font-mono text-xs text-coral">18+</span>
        </div>
        <div className="px-5 pt-5 pb-6 sm:px-7">
          <ReactionMascot reaction={declined ? 'party' : 'professor'} className="mx-auto mb-3 h-28 w-28" small />
          {declined ? (
            <>
              <h1 id="age-title" ref={headingRef} tabIndex={-1} className="font-display text-4xl font-black uppercase outline-none">
                {MICROCOPY.ageGateDeclinedTitle}
              </h1>
              <p className="mt-2 text-muted">{MICROCOPY.ageGateDeclinedBody}</p>
              <button type="button" onClick={() => setDeclined(false)} className="mt-5 text-sm text-muted underline underline-offset-4 hover:text-paper">
                {MICROCOPY.ageGateMisclick}
              </button>
            </>
          ) : (
            <>
              <h1 id="age-title" ref={headingRef} tabIndex={-1} className="font-display text-4xl font-black uppercase outline-none">
                {MICROCOPY.ageGateTitle}
              </h1>
              <p className="mt-2 leading-relaxed text-muted">{MICROCOPY.ageGateBody}</p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <button type="button" onClick={onConfirm} className="press flex-1 rounded-xl bg-lime px-5 py-3.5 font-bold text-ink hover:bg-[#d4ff7f]">
                  {MICROCOPY.ageGateYes}
                </button>
                <button type="button" onClick={() => setDeclined(true)} className="press flex-1 rounded-xl border border-line-strong px-5 py-3.5 hover:border-paper">
                  {MICROCOPY.ageGateNo}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
