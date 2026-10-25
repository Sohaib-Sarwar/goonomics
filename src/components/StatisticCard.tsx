import type { ReactNode } from 'react'
import type { AssumptionKind } from '../lib/assumptions'
import { SOURCES, type SourceId } from '../lib/sources'

const KIND_LABEL: Record<AssumptionKind, string> = {
  'population-median': 'population median',
  'measured-average': 'measured average, small study',
  'reference-limit': 'clinical reference limit',
  'selected-assumption': 'our assumption',
  fictional: 'fictional',
}

/** A labelled report section. Sizes differ by importance; nothing here is a uniform card kit. */
export function StatisticCard({
  index,
  title,
  children,
  className = '',
  id,
}: {
  index?: number
  title: string
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={`border-t border-line-strong pt-5 ${className}`}>
      <h3 id={id ? `${id}-title` : undefined} className="flex items-baseline gap-3">
        {index !== undefined && <span className="tabular font-mono text-xs text-lime">§{index}</span>}
        <span className="font-display text-2xl font-extrabold uppercase sm:text-3xl">{title}</span>
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function KindBadge({ kind }: { kind: AssumptionKind }) {
  const tone = kind === 'fictional' ? 'border-coral/60 text-coral' : kind === 'selected-assumption' ? 'border-manila/60 text-manila' : 'border-line-strong text-muted'
  return <span className={`inline-block border px-1.5 py-px font-mono text-[0.68rem] whitespace-nowrap ${tone}`}>{KIND_LABEL[kind]}</span>
}

export function Cite({ ids }: { ids: readonly SourceId[] }) {
  if (ids.length === 0) return null
  return (
    <span className="font-mono text-[0.7rem] text-faint">
      {ids.map((id, i) => (
        <span key={id}>
          {i > 0 && ', '}
          <a href={SOURCES[id].url} target="_blank" rel="noopener noreferrer" className="underline decoration-line-strong underline-offset-2 hover:text-paper">
            {SOURCES[id].short}
          </a>
        </span>
      ))}
    </span>
  )
}
