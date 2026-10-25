const POINTS: [string, string][] = [
  ['Your answers never leave your device.', 'All calculations run in your browser. There is no backend, no database and no API call with your numbers in it.'],
  ['No analytics, no trackers, no cookies.', 'We do not load any analytics or ad scripts. Fonts and images are served from this site, not from third parties.'],
  ['Nothing is saved.', 'Your answers live in memory and disappear when you close or reload the tab. The only thing stored is your 18+ confirmation, in this tab’s session storage.'],
  ['Report cards are made locally.', 'The PNG and the copied text are generated in your browser. There is no share link, because a link would have to carry your numbers.'],
  ['AI art was made once, in advance.', 'The mascot and lab images were generated before launch. Your inputs are never sent to any image service.'],
  ['Hosting logs exist.', 'Like any website, the host receives standard request data (such as IP address and browser) when you load pages. It never receives your answers.'],
]

export function PrivacyNotice() {
  return (
    <section id="privacy" aria-labelledby="privacy-title" className="scroll-mt-16 border-t border-line bg-panel/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 id="privacy-title" className="font-display text-5xl font-black uppercase sm:text-6xl">
          Privacy
        </h2>
        <p className="mt-4 max-w-xl text-lg text-paper/85">Your lore stays classified. Here is precisely what this site does and does not do.</p>
        <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {POINTS.map(([title, body]) => (
            <div key={title} className="border-t border-line-strong pt-4">
              <dt className="font-semibold">{title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
