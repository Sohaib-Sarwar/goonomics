import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadingScript } from '../lib/copy/select'
import { MICROCOPY } from '../lib/copy/lines'
import { Mascot } from './Mascot'

const STEP_MS = 520
const STEP_MS_REDUCED = 260

/**
 * Pure theatre. The result is already computed before this mounts; the sequence just gives it
 * an entrance, and the skip button ends it immediately.
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
      const t = window.setTimeout(finish, ms + 200)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), ms)
    return () => window.clearTimeout(t)
  }, [step, script.length, reduce, finish])

  const progress = Math.round(((step + 1) / script.length) * 100)

  return (
    <section aria-labelledby="loading-title" className="grid-paper flex min-h-[calc(100svh-61px)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <h2 id="loading-title" ref={headingRef} tabIndex={-1} className="font-mono text-xs text-muted outline-none">
          Audit in progress, file GN-{String(seed % 100000).padStart(5, '0')}
        </h2>

        <div className="relative mt-4 h-[min(22rem,42svh)] overflow-hidden border border-line bg-panel">
          <Corners />
          <Mascot className="absolute inset-x-0 top-[8%] mx-auto h-[78%] w-[78%]" mood={step > script.length / 2 ? 'textbook' : 'suspicious'} decorative eager />
          {!reduce && (
            <div aria-hidden className="absolute inset-x-0 top-0 h-full motion-safe:animate-scan">
              <div className="h-px bg-lime shadow-[0_0_18px_4px_rgb(197_255_92/0.55)]" />
              <div className="h-16 bg-gradient-to-b from-lime/15 to-transparent" />
            </div>
          )}
          <span className="absolute bottom-3 left-3 font-mono text-[0.65rem] text-faint">specimen: your lore</span>
          <span className="tabular absolute right-3 bottom-3 font-mono text-[0.65rem] text-lime">{progress}%</span>
        </div>

        <div
          className="mt-4 h-1 w-full bg-line"
          role="progressbar"
          aria-label="Audit progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="h-full bg-lime transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <ol className="mt-5 min-h-[9.5rem] space-y-1 font-mono text-sm" aria-hidden>
          {script.slice(Math.max(0, step - 3), step).map((line) => (
            <li key={line} className="truncate text-faint">
              <span className="text-lime/60">ok</span> {line}
            </li>
          ))}
          <AnimatePresence mode="wait">
            <motion.li
              key={script[step]}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-paper"
            >
              <span className="text-lime">&gt;</span> {script[step]}
              <span className="motion-safe:animate-blink text-lime">▍</span>
            </motion.li>
          </AnimatePresence>
        </ol>
        <p role="status" aria-live="polite" className="sr-only">
          {script[step]}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
          <p className="max-w-xs text-xs text-muted">
            The math already finished on your device in about a millisecond. This part is purely for drama.
          </p>
          <button type="button" onClick={finish} className="border border-line-strong px-4 py-2 text-sm hover:border-paper">
            {MICROCOPY.skip}
          </button>
        </div>
      </div>
    </section>
  )
}

function Corners() {
  const c = 'absolute h-5 w-5 border-lime'
  return (
    <div aria-hidden>
      <span className={`${c} top-2 left-2 border-t-2 border-l-2`} />
      <span className={`${c} top-2 right-2 border-t-2 border-r-2`} />
      <span className={`${c} bottom-2 left-2 border-b-2 border-l-2`} />
      <span className={`${c} right-2 bottom-2 border-r-2 border-b-2`} />
    </div>
  )
}
