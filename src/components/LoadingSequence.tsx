import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MICROCOPY } from '../lib/copy/lines'
import { loadingScript } from '../lib/copy/select'
import { ReactionMascot } from './Mascot'

const STEP_MS = 480
const STEP_MS_REDUCED = 220

/**
 * Pure theatre. The result is computed before this mounts; the sequence gives it an entrance and
 * the skip button ends it immediately.
 */
export function LoadingSequence({ seed, onDone }: { seed: number; onDone: () => void }) {
  const reduce = useReducedMotion()
  const script = useMemo(() => loadingScript(seed), [seed])
  const [step, setStep] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const done = useRef(false)

  const finish = useCallback(() => {
    if (done.current) return
    done.current = true
    onDone()
  }, [onDone])

  useEffect(() => headingRef.current?.focus(), [])

  useEffect(() => {
    const ms = reduce ? STEP_MS_REDUCED : STEP_MS
    if (step >= script.length - 1) {
      const t = window.setTimeout(finish, ms + 150)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), ms)
    return () => window.clearTimeout(t)
  }, [step, script.length, reduce, finish])

  const progress = Math.round(((step + 1) / script.length) * 100)

  return (
    <section aria-labelledby="loading-title" className="grid-paper flex flex-1 flex-col items-center justify-center px-4 py-6">
      <h2 id="loading-title" ref={headingRef} tabIndex={-1} className="font-display text-4xl font-black uppercase outline-none">
        {MICROCOPY.loadingTitle}
        <span className="motion-safe:animate-blink text-lime">.</span>
      </h2>

      <div className="relative mt-4 h-[min(16rem,34svh)] w-[min(16rem,34svh)]">
        <ReactionMascot reaction="sweat" className="h-full w-full" />
        {!reduce && (
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute inset-x-0 top-0 h-full motion-safe:animate-scan">
              <div className="h-0.5 bg-lime shadow-[0_0_18px_4px_rgb(197_255_92/0.55)]" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 w-full max-w-md">
        <div className="flex items-center justify-between font-mono text-xs text-muted">
          <span>Audit progress</span>
          <span className="tabular text-lime">{progress}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Audit progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <div className="h-full rounded-full bg-lime transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-4 min-h-[3.5rem] text-center" aria-hidden>
          <AnimatePresence mode="wait">
            <motion.p
              key={script[step]}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="text-lg font-semibold"
            >
              {script[step]}
            </motion.p>
          </AnimatePresence>
        </div>
        <p role="status" aria-live="polite" className="sr-only">
          {script[step]}
        </p>
        <div className="mt-3 flex flex-col items-center gap-2">
          <button type="button" onClick={finish} className="press rounded-xl border border-line-strong px-5 py-2.5 font-semibold hover:border-paper">
            {MICROCOPY.skip}
          </button>
          <p className="text-center text-xs text-faint">{MICROCOPY.loadingNote}</p>
        </div>
      </div>
    </section>
  )
}
