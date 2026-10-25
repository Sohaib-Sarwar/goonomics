import { Mascot } from './Mascot'
import { Wordmark } from './Wordmark'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label="GOONOMICS, back to top">
          <Mascot className="h-10 w-10" small decorative eager />
          <Wordmark size="sm" />
        </a>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm sm:gap-2">
          <a href="#methodology" className="hidden px-2 py-1.5 text-muted hover:text-paper sm:block">
            Methodology
          </a>
          <a href="#privacy" className="hidden px-2 py-1.5 text-muted hover:text-paper sm:block">
            Privacy
          </a>
          <a href="#methodology" className="px-2 py-1.5 text-muted hover:text-paper sm:hidden">
            How it works
          </a>
          <span
            className="ml-1 rounded-full border border-coral/60 px-2.5 py-0.5 font-mono text-xs text-coral"
            title="Adults only"
          >
            18+
          </span>
        </nav>
      </div>
    </header>
  )
}
