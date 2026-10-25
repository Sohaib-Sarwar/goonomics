import { Lock } from 'lucide-react'
import { ACHIEVEMENTS, BADGE_CATEGORIES, type Achievement } from '../lib/achievements'
import { RANK_BADGES, nextRank } from '../lib/badges'
import { SCORE_MANUAL } from '../lib/copy/lines'
import { BadgeEmblem } from './Badge'
import { Sheet } from './ui'

/**
 * "So how cooked are you?": the rank badge ladder (from the GOI), the gooning badge categories
 * with what is unlocked, and how the score is computed.
 */
export function ScoreManual({ open, onClose, score, achievements = [] }: { open: boolean; onClose: () => void; score?: number; achievements?: Achievement[] }) {
  const unlocked = new Set(achievements.map((a) => a.id))
  const next = score !== undefined ? nextRank(score) : null
  return (
    <Sheet open={open} onClose={onClose} title={SCORE_MANUAL.title} wide>
      <p className="font-mono text-xs text-lime">Rank badges, earned from your GOI</p>
      {next && (
        <p className="mt-1 text-sm text-muted">
          {next.points} more GOI points to <span className="font-semibold" style={{ color: next.badge.tone }}>{next.badge.name}</span>.
        </p>
      )}
      <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {RANK_BADGES.map((b, i) => {
          const max = (RANK_BADGES[i + 1]?.min ?? 851) - 1
          const mine = score !== undefined && score >= b.min && score <= max
          const locked = score !== undefined && score < b.min
          return (
            <li key={b.id} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${mine ? 'bg-lime/10 ring-1 ring-lime' : 'bg-ink/60'}`}>
              <BadgeEmblem badge={b} locked={locked} className="h-12 w-12" />
              <span className="min-w-0">
                <span className="block font-display text-lg leading-none font-black uppercase" style={{ color: locked ? undefined : b.tone }}>
                  {b.name}
                  {mine && <span className="ml-2 align-middle font-sans text-xs font-semibold text-lime normal-case">you are here</span>}
                </span>
                <span className="tabular block font-mono text-[0.7rem] text-faint">
                  GOI {b.min} to {max}
                </span>
                <span className="block text-sm leading-snug text-muted">{b.tagline}</span>
              </span>
            </li>
          )
        })}
      </ol>

      <p className="mt-5 font-mono text-xs text-lime">Badge categories</p>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BADGE_CATEGORIES.map((c) => (
          <div key={c.id} className="rounded-xl border border-line px-3 py-2.5">
            <p className="font-display text-lg leading-none font-black uppercase">{c.id}</p>
            <p className="text-xs text-muted">{c.blurb}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {ACHIEVEMENTS.filter((a) => a.category === c.id).map((a) => {
                const on = unlocked.has(a.id)
                return (
                  <li
                    key={a.id}
                    title={a.rule}
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${on ? 'border-lime/60 bg-lime/10 text-lime' : 'border-line-strong text-faint'}`}
                  >
                    {!on && <Lock size={10} aria-hidden />}
                    {a.name}
                    <span className="sr-only">{on ? ', unlocked' : `, locked: ${a.rule}`}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <details className="mt-4 rounded-xl border border-line px-4 py-3">
        <summary className="cursor-pointer font-semibold select-none">The formula, in one sentence</summary>
        <p className="mt-2 text-sm text-paper/90">{SCORE_MANUAL.formula}</p>
        <p className="mt-2 text-sm text-muted">{SCORE_MANUAL.same}</p>
      </details>
      <p className="mt-4 text-sm text-muted">{SCORE_MANUAL.disclaimer}</p>
    </Sheet>
  )
}
