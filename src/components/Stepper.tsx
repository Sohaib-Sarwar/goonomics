import { Check, Flame, Receipt, ScrollText } from 'lucide-react'
import { MICROCOPY } from '../lib/copy/lines'

export type StepId = 1 | 2 | 3

const STEPS = [
  { id: 1, label: MICROCOPY.stepLore, Icon: ScrollText },
  { id: 2, label: MICROCOPY.stepReceipts, Icon: Receipt },
  { id: 3, label: MICROCOPY.stepCooked, Icon: Flame },
] as const

/**
 * Checkout style progress: circular icons on a connected line. Completed steps are clickable so
 * people can jump back without losing anything.
 */
export function Stepper({ current, done, onGo }: { current: StepId; done: boolean; onGo: (step: StepId) => void }) {
  // `done` means step 3 has been reached (results exist), so every step counts as complete.
  const fill = done ? 100 : current === 1 ? 0 : current === 2 ? 50 : 100
  return (
    <nav aria-label="Audit progress" className="mx-auto w-full max-w-md px-6">
      <ol className="relative flex items-start justify-between">
        <div aria-hidden className="absolute top-5 right-[16%] left-[16%] h-[3px] rounded-full bg-line-strong">
          <div className="h-full rounded-full bg-lime transition-[width] duration-500 ease-out" style={{ width: `${fill}%` }} />
        </div>
        {STEPS.map(({ id, label, Icon }) => {
          const isCurrent = id === current
          const isComplete = id < current || (done && id !== current)
          const clickable = isComplete || (done && id !== current)
          const circle = isCurrent
            ? 'border-lime bg-ink text-lime motion-safe:animate-ring'
            : isComplete
              ? 'border-lime bg-lime text-ink'
              : 'border-line-strong bg-ink text-faint'
          const content = (
            <>
              <span className={`press relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 ${circle}`}>
                {isComplete && !isCurrent ? <Check size={18} strokeWidth={3} aria-hidden /> : <Icon size={18} aria-hidden />}
              </span>
              <span className={`mt-1.5 text-center text-xs font-semibold tracking-wide whitespace-nowrap ${isCurrent ? 'text-paper' : isComplete ? 'text-lime' : 'text-faint'}`}>
                <span className="tabular font-mono">{id}</span> {label}
              </span>
            </>
          )
          return (
            <li key={id} className="relative flex w-1/3 flex-col items-center" aria-current={isCurrent ? 'step' : undefined}>
              {clickable ? (
                <button type="button" onClick={() => onGo(id)} className="flex flex-col items-center" aria-label={`Go to step ${id}: ${label}`}>
                  {content}
                </button>
              ) : (
                <div className="flex flex-col items-center" aria-label={`Step ${id}: ${label}${isCurrent ? ', current' : ''}`}>
                  {content}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
