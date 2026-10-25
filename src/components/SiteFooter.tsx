import { Wordmark } from './Wordmark'

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-sm text-paper/85">Your lore. Your losses. The spreadsheet is cooked.</p>
          <p className="mt-1 text-sm text-muted">We did the math. The math needs therapy.</p>
        </div>
        <div className="text-sm text-muted md:text-right">
          <nav aria-label="Footer" className="flex gap-4 md:justify-end">
            <a href="#methodology" className="hover:text-paper">
              Methodology
            </a>
            <a href="#privacy" className="hover:text-paper">
              Privacy
            </a>
          </nav>
          <p className="mt-3 max-w-xs">For adults. Entertainment only, not medical advice. Issued by the Department of Unnecessary Statistics, which does not exist.</p>
        </div>
      </div>
    </footer>
  )
}
