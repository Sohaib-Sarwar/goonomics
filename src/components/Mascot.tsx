import { useState, type ReactNode } from 'react'
import { ASSETS } from '../lib/assets'
import type { Reaction } from '../lib/copy/verdicts'

interface MascotProps {
  className?: string
  small?: boolean
  /** Decorative mascots get empty alt text so screen readers skip them. */
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
          className="h-full w-full object-contain drop-shadow-[0_18px_30px_rgb(0_0_0/0.55)]"
        />
      )}
    </div>
  )
}

const POSE: Record<Reaction, string> = {
  audit: 'motion-safe:animate-bob',
  sweat: 'motion-safe:animate-[shake_0.6s_ease-in-out_infinite]',
  shock: 'motion-safe:animate-shake',
  party: 'motion-safe:animate-bob',
  void: 'saturate-[0.35] brightness-90 motion-safe:animate-drift',
  professor: 'rotate-2 motion-safe:animate-bob',
  stamp: '-rotate-3',
}

/**
 * Meme reactions built from the real mascot plus SVG props and CSS motion, in one consistent
 * flat style. Captions are live HTML so spelling stays exact.
 */
export function ReactionMascot({
  reaction,
  className = '',
  bubble,
  bubbleSide = 'left',
  small = false,
}: {
  reaction: Reaction
  className?: string
  bubble?: ReactNode
  bubbleSide?: 'left' | 'right' | 'top'
  small?: boolean
}) {
  return (
    <div className={`relative ${className}`}>
      {bubble && <SpeechBubble side={bubbleSide}>{bubble}</SpeechBubble>}
      <div className={`relative h-full w-full ${POSE[reaction]}`}>
        <Mascot className="h-full w-full" small={small} decorative eager />
        <Prop reaction={reaction} />
      </div>
    </div>
  )
}

function SpeechBubble({ side, children }: { side: 'left' | 'right' | 'top'; children: ReactNode }) {
  const pos =
    side === 'top'
      ? 'bottom-[96%] left-1/2 -translate-x-1/2'
      : side === 'left'
        ? 'top-[2%] right-[78%]'
        : 'top-[2%] left-[78%]'
  return (
    <div
      role="note"
      className={`absolute z-10 w-max max-w-[14rem] motion-safe:animate-pop rounded-2xl border-2 border-ink bg-paper px-3.5 py-2 text-[0.95rem] leading-snug font-semibold text-ink shadow-[4px_4px_0_#0c0c0f] ${pos}`}
    >
      {children}
    </div>
  )
}

function Prop({ reaction }: { reaction: Reaction }) {
  switch (reaction) {
    case 'sweat':
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
    case 'shock':
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
    case 'party':
      return (
        <svg viewBox="0 0 100 100" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <path d="M44 2 L58 2 L51 -16 Z" transform="rotate(-12 51 0)" fill="#ff6b6b" stroke="#0c0c0f" strokeWidth="2" />
          <circle cx="47" cy="-15" r="3" fill="#c5ff5c" stroke="#0c0c0f" strokeWidth="1.5" />
          {(
            [
              ['#c5ff5c', 14, 30, 0],
              ['#ff6b6b', 86, 26, 0.3],
              ['#7cc4ff', 22, 10, 0.6],
              ['#cdbf94', 80, 8, 0.9],
              ['#f5f5f5', 92, 44, 0.45],
              ['#c5ff5c', 6, 50, 0.75],
            ] as const
          ).map(([c, x, y, d]) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="5"
              height="3"
              fill={c}
              className="motion-safe:animate-confetti"
              style={{ animationDelay: `${d}s`, transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          ))}
        </svg>
      )
    case 'void':
      return (
        <svg viewBox="0 0 100 100" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <g transform="translate(12 52)">
            <rect x="0" y="0" width="16" height="18" rx="2" fill="#f5f5f5" stroke="#0c0c0f" strokeWidth="2" />
            <path d="M16 4 h4 a4 4 0 0 1 0 8 h-4" fill="none" stroke="#0c0c0f" strokeWidth="2" />
            <path d="M4 -3 q2 -3 0 -6 M9 -3 q2 -3 0 -6" stroke="#9898a5" strokeWidth="1.5" fill="none" />
          </g>
          <g fill="#9898a5">
            <circle cx="78" cy="12" r="1.8" />
            <circle cx="84" cy="12" r="1.8" />
            <circle cx="90" cy="12" r="1.8" />
          </g>
        </svg>
      )
    case 'professor':
      return (
        <svg viewBox="0 0 100 100" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <g transform="translate(29 -1) rotate(-6 21 8)">
            <path d="M21 0 L44 8 L21 16 L-2 8 Z" fill="#17171c" stroke="#0c0c0f" strokeWidth="2" strokeLinejoin="round" />
            <path d="M9 12 v7 c0 3 6 5 12 5 s12 -2 12 -5 v-7 L21 16 Z" fill="#202027" stroke="#0c0c0f" strokeWidth="2" />
            <path d="M40 9 v10" stroke="#c5ff5c" strokeWidth="2" strokeLinecap="round" />
            <circle cx="40" cy="20" r="2" fill="#c5ff5c" />
          </g>
        </svg>
      )
    case 'stamp':
      return (
        <svg viewBox="0 0 100 100" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <g transform="translate(0 30) rotate(-14 14 16)">
            <rect x="9" y="0" width="10" height="14" rx="4" fill="#202027" stroke="#0c0c0f" strokeWidth="2" />
            <rect x="2" y="14" width="24" height="7" rx="1.5" fill="#17171c" stroke="#0c0c0f" strokeWidth="2" />
            <rect x="1" y="21" width="26" height="6" rx="1" fill="#ff6b6b" stroke="#0c0c0f" strokeWidth="2" />
          </g>
        </svg>
      )
    default:
      return null
  }
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
      className={`inline-block -rotate-9 border-coral font-display font-black tracking-[0.12em] whitespace-nowrap text-coral uppercase ${s} ${className}`}
      style={{ maskImage: 'radial-gradient(circle at 30% 40%, black 60%, rgb(0 0 0 / 0.78) 61%, black 75%)' }}
    >
      {children}
    </span>
  )
}
