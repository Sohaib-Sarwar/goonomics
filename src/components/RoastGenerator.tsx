import { RefreshCw } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { MICROCOPY } from '../lib/copy/lines'

/** Shows the seeded roast; "new roast" bumps the copy seed only, never the numbers. */
export function RoastGenerator({ roast, onReroll }: { roast: string; onReroll: () => void }) {
  const reduce = useReducedMotion()
  return (
    <figure className="relative border-l-2 border-lime pl-5 sm:pl-7">
      <figcaption className="font-mono text-xs text-muted">Auditor’s remark</figcaption>
      <blockquote aria-live="polite" className="mt-2 min-h-[4.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={roast}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="font-display text-3xl leading-[1.05] font-bold sm:text-4xl"
          >
            “{roast}”
          </motion.p>
        </AnimatePresence>
      </blockquote>
      <button type="button" onClick={onReroll} className="mt-4 inline-flex items-center gap-2 text-sm text-muted hover:text-lime">
        <RefreshCw size={15} aria-hidden /> {MICROCOPY.reroll}
      </button>
    </figure>
  )
}
