import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { ASSETS } from '../lib/assets'
import { Mascot } from './Mascot'

const HEADLINE = ['The lore', 'has been', 'summoned.']

/** What the report contains, as a dossier index. A real sequence, so page numbers are honest. */
const CONTENTS = [
  ['Verdict and roast', '1'],
  ['Lifetime session ledger', '2'],
  ['The little swimmer ledger', '3'],
  ['Side-quest opportunity cost', '4'],
  ['Shareable report card', '5'],
]

export function LandingHero({ onStart }: { onStart: () => void }) {
  const reduce = useReducedMotion()
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-line">
      {!imgFailed && (
        <img
          srcSet={ASSETS.hero.srcSet}
          src={ASSETS.hero.src}
          sizes="100vw"
          width={ASSETS.hero.width}
          height={ASSETS.hero.height}
          alt=""
          fetchPriority="high"
          decoding="async"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[72%_center] opacity-80"
        />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0c0c0f_0%,#0c0c0fee_34%,#0c0c0f88_58%,#0c0c0f22_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" />
      <div aria-hidden className="grid-paper absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(90deg,black,transparent_60%)]" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-14 pb-16 sm:px-6 sm:pt-20 md:grid-cols-[minmax(0,1fr)_auto] md:pb-24">
        <div className="max-w-xl">
          <p className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="inline-block h-2 w-2 rounded-full bg-lime shadow-[0_0_10px_#c5ff5c]" />
            Case file GN-0001, investigation open
            <span className="motion-safe:animate-blink text-lime">_</span>
          </p>

          <h1 id="hero-title" className="mt-5 font-display text-[clamp(3.4rem,11vw,7.25rem)] leading-[0.86] font-black tracking-[-0.015em] uppercase">
            {HEADLINE.map((line, i) => (
              <span key={line} className="relative block w-fit overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
                  animate={{ clipPath: 'inset(0 0% 0 0)' }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.22, ease: [0.7, 0, 0.2, 1] }}
                >
                  {line}
                </motion.span>
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute top-0 bottom-1 w-2 bg-lime shadow-[0_0_24px_#c5ff5c]"
                    initial={{ left: '0%', opacity: 1 }}
                    animate={{ left: '100%', opacity: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.22, ease: [0.7, 0, 0.2, 1] }}
                  />
                )}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/85">
            Enter your lore. We turn your best estimates into a deeply unnecessary scientific report, with real sources and
            fake prestige.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button
              type="button"
              onClick={onStart}
              className="group relative bg-lime px-7 py-4 font-display text-xl font-extrabold tracking-wide text-ink uppercase transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Run my goon audit
              <span aria-hidden className="absolute -right-1.5 -bottom-1.5 -z-10 h-full w-full border border-lime/60 transition-all group-hover:-right-2.5 group-hover:-bottom-2.5" />
            </button>
            <a href="#methodology" className="text-paper/80 underline decoration-line-strong underline-offset-[6px] hover:text-paper hover:decoration-lime">
              How does this thing even work?
            </a>
          </div>
          <p className="mt-5 max-w-sm text-sm text-muted">Takes about a minute. Nothing you type leaves your device.</p>
        </div>

        <aside aria-label="Report contents" className="relative hidden self-end md:block">
          <div className="w-64 border border-line bg-panel/90 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="font-mono text-xs text-muted">Report contents</span>
              <span className="font-mono text-xs text-faint">p.</span>
            </div>
            <ol className="px-4 py-3 text-sm">
              {CONTENTS.map(([title, page]) => (
                <li key={title} className="flex items-baseline gap-2 py-1.5">
                  <span className="text-paper/90">{title}</span>
                  <span aria-hidden className="dot-leader h-3 flex-1" />
                  <span className="tabular font-mono text-xs text-muted">{page}</span>
                </li>
              ))}
            </ol>
          </div>
          <Mascot className="absolute -top-36 -right-4 h-44 w-44" mood="suspicious" decorative eager />
        </aside>
      </div>
    </section>
  )
}
