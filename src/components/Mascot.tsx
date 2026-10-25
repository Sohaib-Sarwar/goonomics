import { useState, type ReactNode } from 'react'
import { ASSETS, STICKERS, type StickerName } from '../lib/assets'
import type { Reaction } from '../lib/copy/verdicts'

interface MascotProps {
  className?: string
  small?: boolean
  /** Decorative images get empty alt text so screen readers skip them. */
  decorative?: boolean
  eager?: boolean
}

/** The auditor artwork, with a hand drawn SVG stand in if the image fails to load. */
export function Mascot({ className = '', small = false, decorative = false, eager = false }: MascotProps) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`isolate select-none ${className}`}>
      {failed ? (
        <MascotFallback label={decorative ? undefined : ASSETS.mascot.alt} />
      ) : (
        <img
          src={small ? ASSETS.mascot.small : ASSETS.mascot.src}
          width={ASSETS.mascot.width}
          height={ASSETS.mascot.height}
          alt={decorative ? '' : ASSETS.mascot.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full object-contain drop-shadow-[0_14px_24px_rgb(0_0_0/0.5)]"
        />
      )}
    </div>
  )
}

const STICKER_POSE: Record<StickerName, string> = {
  cry: 'motion-safe:animate-[shake_1.6s_ease-in-out_infinite]',
  inspect: 'motion-safe:animate-bob',
  stare: 'motion-safe:animate-drift',
  cheer: 'motion-safe:animate-bob',
  paper: '-rotate-2 motion-safe:animate-bob',
}

const isSticker = (r: Reaction): r is StickerName => r in STICKERS

/** Keep a caller supplied position (absolute, fixed) instead of forcing relative over it. */
const positioned = (cls: string) => (/(absolute|fixed|sticky)/.test(cls) ? '' : 'relative')

/**
 * A reaction: a Higgsfield sticker (cry, inspect, stare, cheer, paper) or the original auditor
 * with SVG props (auditor, sweat, shock). Captions are live HTML so spelling stays exact.
 */
export function ReactionArt({ reaction, className = '', decorative = true }: { reaction: Reaction; className?: string; decorative?: boolean }) {
  const [failed, setFailed] = useState(false)
  if (isSticker(reaction) && !failed) {
    const s = STICKERS[reaction]
    return (
      <div className={`${positioned(className)} select-none ${className}`}>
        <img
          src={s.src}
          alt={decorative ? '' : s.alt}
          width={512}
          height={512}
          draggable={false}
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full object-contain drop-shadow-[0_14px_24px_rgb(0_0_0/0.5)] ${STICKER_POSE[reaction]}`}
        />
      </div>
    )
  }
  const pose = reaction === 'sweat' ? 'motion-safe:animate-[shake_0.6s_ease-in-out_infinite]' : reaction === 'shock' ? 'motion-safe:animate-shake' : 'motion-safe:animate-bob'
  return (
    <div className={`${positioned(className)} select-none ${className}`}>
      <div className={`relative h-full w-full ${pose}`}>
        <Mascot className="h-full w-full" decorative eager />
        <Prop reaction={reaction} />
      </div>
    </div>
  )
}

/**
 * Speech bubble anchored above its owner and clamped to the owner's width or a sane maximum,
 * so it can never hang outside the viewport. `live` makes screen readers announce changes.
 */
export function Bubble({ children, live = false, className = '', tail = 'down' }: { children: ReactNode; live?: boolean; className?: string; tail?: 'down' | 'left' | 'none' }) {
  return (
    <div
      role={live ? 'status' : 'note'}
      aria-live={live ? 'polite' : undefined}
      className={`relative w-full max-w-[22rem] rounded-2xl border-2 border-ink bg-paper px-3.5 py-2 text-[0.95rem] leading-snug font-semibold text-pretty text-ink shadow-[4px_4px_0_#0c0c0f] tiny:py-1.5 tiny:text-sm ${className}`}
    >
      <span key={typeof children === 'string' ? children : undefined} className="block motion-safe:animate-pop">
        {children}
      </span>
      {tail === 'down' && <span aria-hidden className="absolute -bottom-[9px] left-8 h-4 w-4 rotate-45 border-r-2 border-b-2 border-ink bg-paper" />}
      {tail === 'left' && <span aria-hidden className="absolute top-4 -left-[9px] h-4 w-4 rotate-45 border-b-2 border-l-2 border-ink bg-paper" />}
    </div>
  )
}

function Prop({ reaction }: { reaction: Reaction }) {
  if (reaction === 'sweat') {
    return (
      <svg viewBox="0 0 100 100" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        {[
          [70, 14, 0],
          [78, 26, 0.5],
          [28, 20, 0.9],
        ].map(([x, y, d]) => (
          <path
            key={`${x}-${y}`}
            d={`M${x} ${y}c0 0 -4 6 -4 9a4 4 0 0 0 8 0c0 -3 -4 -9 -4 -9z`}
            fill="#7cc4ff"
            stroke="#0c0c0f"
            strokeWidth="1.6"
            className="motion-safe:animate-sweat"
            style={{ animationDelay: `${d}s`, transformBox: 'fill-box' }}
          />
        ))}
      </svg>
    )
  }
  if (reaction === 'shock') {
    return (
      <svg viewBox="0 0 100 100" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <g stroke="#ff6b6b" strokeWidth="4" strokeLinecap="round">
          <path d="M74 4 L77 18" />
          <path d="M84 8 L80 20" />
          <path d="M90 18 L82 24" />
        </g>
        <circle cx="12" cy="10" r="3" fill="#ff6b6b" />
        <circle cx="20" cy="4" r="2" fill="#ff6b6b" />
      </svg>
    )
  }
  return null
}

/** Simplified vector auditor, used only when the artwork cannot load. */
export function MascotFallback({ label }: { label?: string }) {
  return (
    <svg viewBox="0 0 200 220" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} className="h-full w-full">
      <path
        d="M100 18c40 0 62 30 62 72 0 34-14 60-36 74 6 18 26 30 40 34-24 8-56 0-70-20-30-12-58-44-58-88 0-42 22-72 62-72Z"
        fill="#C5FF5C"
        stroke="#0C0C0F"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <rect x="54" y="70" width="38" height="26" rx="4" fill="#F5F5F5" stroke="#0C0C0F" strokeWidth="6" />
      <rect x="108" y="70" width="38" height="26" rx="4" fill="#F5F5F5" stroke="#0C0C0F" strokeWidth="6" />
      <path d="M92 80h16" stroke="#0C0C0F" strokeWidth="6" />
      <path d="M62 84h22M116 84h22" stroke="#0C0C0F" strokeWidth="8" strokeLinecap="round" />
      <path d="M88 122c8-5 18-5 26 0" stroke="#0C0C0F" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="112" y="136" width="30" height="36" rx="3" fill="#F5F5F5" stroke="#0C0C0F" strokeWidth="5" />
      <rect x="121" y="131" width="12" height="8" rx="2" fill="#FF6B6B" stroke="#0C0C0F" strokeWidth="3" />
    </svg>
  )
}

/** The official stamp. Live text, so "COOKED" is always spelled right. */
export function Stamp({ children, className = '', size = 'md' }: { children: ReactNode; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'lg' ? 'px-5 py-1.5 text-4xl border-[5px]' : size === 'sm' ? 'px-2 py-0.5 text-base border-2' : 'px-3 py-1 text-2xl border-[3px]'
  return (
    <span
      className={`inline-block -rotate-9 border-coral bg-ink/85 font-display font-black tracking-[0.12em] whitespace-nowrap text-coral uppercase ${s} ${className}`}
      style={{ maskImage: 'radial-gradient(circle at 30% 40%, black 60%, rgb(0 0 0 / 0.78) 61%, black 75%)' }}
    >
      {children}
    </span>
  )
}
