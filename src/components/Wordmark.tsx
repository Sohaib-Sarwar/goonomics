/**
 * The wordmark is live type, never a generated image, so the spelling is always exact.
 * The lime "OO" doubles as the auditor's glasses.
 */
export function Wordmark({ size = 'md', withDescriptor = true }: { size?: 'sm' | 'md' | 'lg'; withDescriptor?: boolean }) {
  const text = size === 'lg' ? 'text-6xl sm:text-7xl' : size === 'sm' ? 'text-xl' : 'text-[1.7rem]'
  return (
    <span className="inline-flex flex-col leading-none">
      <span className={`font-display font-black tracking-[-0.01em] text-paper uppercase ${text}`} aria-label="GOONOMICS">
        <span aria-hidden>G</span>
        <span aria-hidden className="text-lime">
          OO
        </span>
        <span aria-hidden>NOMICS</span>
      </span>
      {withDescriptor && (
        <span className="mt-1 font-mono text-[0.62rem] tracking-[0.18em] text-muted">THE GOON AUDIT</span>
      )}
    </span>
  )
}
