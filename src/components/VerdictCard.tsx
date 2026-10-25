import { motion, useReducedMotion } from 'motion/react'
import type { Verdict } from '../lib/copy/verdicts'
import { Mascot } from './Mascot'

/** The one loud moment on the site: the verdict stamp lands on the file. */
export function VerdictCard({ verdict, headline, fileNo }: { verdict: Verdict; headline: string; fileNo: string }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative overflow-hidden border border-line bg-panel">
      <div aria-hidden className="absolute top-0 left-6 h-2 w-28 bg-manila/80" />
      <div className="grid grid-cols-1 gap-6 p-5 pt-8 sm:p-8 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center">
        <div className="min-w-0">
          <p className="pr-36 font-mono text-xs text-muted sm:pr-44 md:pr-0">{headline}</p>
          <p className="mt-6 font-mono text-xs text-lime">§1 Verdict, file {fileNo}</p>
          <h2 id="verdict-title" className="mt-2 font-display text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.88] font-black tracking-[-0.01em] uppercase">
            {verdict.name}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-paper/85">{verdict.blurb}</p>
          <p className="mt-3 text-xs text-faint">An entertainment category, not a diagnosis.</p>
        </div>
        <Mascot className="mx-auto h-48 w-48 md:h-56 md:w-56" mood={verdict.mood} decorative eager />
      </div>

      <motion.div
        aria-hidden
        initial={reduce ? false : { scale: 2.4, opacity: 0, rotate: -24 }}
        animate={{ scale: 1, opacity: 1, rotate: -9 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 520, damping: 22, mass: 0.9 }}
        className="pointer-events-none absolute top-5 right-4 border-[3px] border-coral px-3 py-1 font-display text-xl font-black tracking-[0.12em] text-coral uppercase mix-blend-screen sm:top-8 sm:right-10 sm:text-2xl"
        style={{ maskImage: 'radial-gradient(circle at 30% 40%, black 60%, rgb(0 0 0 / 0.75) 61%, black 75%)' }}
      >
        {verdict.stamp}
      </motion.div>
    </div>
  )
}
