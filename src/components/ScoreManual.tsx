import { GOI_BANDS } from '../lib/goi'
import { SCORE_MANUAL } from '../lib/copy/lines'
import { Sheet } from './ui'

/** "So how cooked are you?": what the GOI means, how it is computed, and what it is not. */
export function ScoreManual({ open, onClose, score }: { open: boolean; onClose: () => void; score?: number }) {
  return (
    <Sheet open={open} onClose={onClose} title={SCORE_MANUAL.title}>
      <p className="font-mono text-xs text-lime">{SCORE_MANUAL.kicker}</p>
      <ol className="mt-3 space-y-1.5">
        {GOI_BANDS.map((b, i) => {
          const next = GOI_BANDS[i + 1]?.min ?? 851
          const mine = score !== undefined && score >= b.min && score < next
          return (
            <li key={b.min} className={`flex items-baseline gap-3 rounded-lg px-3 py-2 ${mine ? 'bg-lime/15 ring-1 ring-lime' : 'bg-ink/60'}`}>
              <span className="tabular w-[4.5rem] shrink-0 font-mono text-sm text-lime">
                {b.min} to {next - 1}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">
                  {b.label}
                  {mine && <span className="ml-2 text-xs text-lime">you are here</span>}
                </span>
                <span className="block text-sm text-muted">{b.blurb}</span>
              </span>
            </li>
          )
        })}
      </ol>
      <details className="mt-4 rounded-xl border border-line px-4 py-3">
        <summary className="cursor-pointer font-semibold select-none">The formula, in one sentence</summary>
        <p className="mt-2 text-sm text-paper/90">{SCORE_MANUAL.formula}</p>
        <p className="mt-2 text-sm text-muted">{SCORE_MANUAL.same}</p>
      </details>
      <p className="mt-4 text-sm text-muted">{SCORE_MANUAL.disclaimer}</p>
    </Sheet>
  )
}
