import { Info } from 'lucide-react'
import { MICROCOPY } from '../lib/copy/lines'
import { Mascot } from './Mascot'
import { Wordmark } from './Wordmark'

export function SiteHeader({ onInfo }: { onInfo: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Mascot className="h-9 w-9" small decorative eager />
          <Wordmark size="sm" />
        </div>
        <div className="flex items-center gap-2">
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
