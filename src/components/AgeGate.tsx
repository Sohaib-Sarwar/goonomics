import { useEffect, useRef, useState } from 'react'
import { MICROCOPY } from '../lib/copy/lines'
import { Mascot } from './Mascot'
import { Wordmark } from './Wordmark'

/**
 * A simple self-declaration screen, not identity verification. The answer lives in
 * sessionStorage for this tab only (if storage is available at all).
 */
export function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const [declined, setDeclined] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => headingRef.current?.focus(), [declined])

  return (
    <div className="grid-paper fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink px-4 py-10">
      <div role="dialog" aria-modal="true" aria-labelledby="age-title" className="w-full max-w-md border border-line bg-panel">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <Wordmark size="sm" />
          <span className="rounded-full border border-coral/60 px-2.5 py-0.5 font-mono text-xs text-coral">18+</span>
        </div>
        <div className="px-5 pt-6 pb-6 sm:px-7">
          <Mascot className="mx-auto mb-4 h-28 w-28" mood={declined ? 'graduate' : 'suspicious'} small decorative eager />
          {declined ? (
            <>
              <h1 id="age-title" ref={headingRef} tabIndex={-1} className="font-display text-3xl font-extrabold uppercase outline-none">
                Respect. Truly.
              </h1>
              <p className="mt-3 text-muted">
                Close the tab, go touch some grass and come back when you are 18. The spreadsheet will wait. It has nowhere to be.
              </p>
              <button type="button" onClick={() => setDeclined(false)} className="mt-6 text-sm text-muted underline underline-offset-4 hover:text-paper">
                Wait, I misclicked
              </button>
            </>
          ) : (
            <>
              <h1 id="age-title" ref={headingRef} tabIndex={-1} className="font-display text-3xl font-extrabold uppercase outline-none">
                {MICROCOPY.ageGateTitle}
              </h1>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{MICROCOPY.ageGateBody}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onConfirm}
                  className="flex-1 bg-lime px-5 py-3.5 font-semibold text-ink transition-colors hover:bg-[#d4ff7f]"
                >
                  {MICROCOPY.ageGateYes}
                </button>
                <button
                  type="button"
                  onClick={() => setDeclined(true)}
                  className="flex-1 border border-line-strong px-5 py-3.5 text-paper transition-colors hover:border-paper"
                >
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
