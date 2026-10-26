import { Info, Leaf } from 'lucide-react'
import { MICROCOPY } from '../lib/copy/lines'
import { tarnLink } from '../lib/tarn'
import { Mascot } from './Mascot'
import { Wordmark } from './Wordmark'

export function SiteHeader({ onInfo, onHome }: { onInfo: () => void; onHome: () => void }) {
  return (
    <header className="shrink-0 border-b border-line/80 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 sm:px-6 tiny:py-1">
        <button type="button" onClick={onHome} className="flex items-center gap-2" aria-label="GOONOMICS home">
          <Mascot className="h-8 w-8 tiny:h-7 tiny:w-7" small decorative eager />
          <Wordmark size="sm" withDescriptor={false} />
        </button>
        <div className="flex items-center gap-2">
          <a href={tarnLink(null)} aria-label={MICROCOPY.monkLink} title={MICROCOPY.monkHint} className="press inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-muted hover:bg-raised hover:text-paper">
            <Leaf size={17} aria-hidden />
            <span aria-hidden className="hidden sm:inline">
              {MICROCOPY.monkLink}
            </span>
          </a>
          <button type="button" onClick={onInfo} aria-label={MICROCOPY.infoButton} className="press inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-muted hover:bg-raised hover:text-paper">
            <Info size={17} aria-hidden />
            <span aria-hidden className="hidden sm:inline">
              {MICROCOPY.infoButton}
            </span>
          </button>
          <span className="rounded-full border border-coral/60 px-2.5 py-0.5 font-mono text-xs text-coral" title="Adults only">
            18+
          </span>
        </div>
      </div>
    </header>
  )
}
