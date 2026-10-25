import { useState } from 'react'
import { ASSETS } from '../lib/assets'
import type { MascotMood } from '../lib/copy/verdicts'

interface MascotProps {
  className?: string
  mood?: MascotMood
  small?: boolean
  /** Decorative mascots get empty alt text so screen readers skip them. */
  decorative?: boolean
  eager?: boolean
}

/**
 * The auditor. Real Higgsfield artwork with SVG props layered on top for each verdict mood,
 * and a hand-drawn SVG stand-in if the image fails to load.
 */
export function Mascot({ className = '', mood, small = false, decorative = false, eager = false }: MascotProps) {
  const [failed, setFailed] = useState(false)
  const pose =
    mood === 'suspicious' ? '-rotate-6' : mood === 'shocked' ? 'motion-safe:animate-shake' : mood === 'graduate' ? 'rotate-2' : ''

  return (
    <div className={`isolate select-none ${className}`}>
      <div className={`relative h-full w-full transition-transform ${pose}`}>
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
        {mood && <MoodProp mood={mood} />}
      </div>
    </div>
  )
}

function MoodProp({ mood }: { mood: MascotMood }) {
  switch (mood) {
    case 'graduate':
      return (
        <svg viewBox="0 0 120 70" aria-hidden className="absolute top-[1%] left-[27%] w-[44%] -rotate-6">
          <path d="M60 4 116 24 60 44 4 24Z" fill="#17171C" stroke="#0C0C0F" strokeWidth="3" strokeLinejoin="round" />
          <path d="M28 33v18c0 7 14 13 32 13s32-6 32-13V33L60 44Z" fill="#202027" stroke="#0C0C0F" strokeWidth="3" />
          <path d="M100 30v22" stroke="#C5FF5C" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="55" r="4" fill="#C5FF5C" />
        </svg>
      )
    case 'textbook':
      return (
        <svg viewBox="0 0 90 70" aria-hidden className="absolute bottom-[14%] left-[2%] w-[38%] -rotate-12">
          <rect x="4" y="8" width="80" height="54" rx="4" fill="#FF6B6B" stroke="#0C0C0F" strokeWidth="4" />
          <rect x="12" y="8" width="8" height="54" fill="#0C0C0F" opacity=".35" />
          <rect x="30" y="22" width="40" height="6" rx="2" fill="#F5F5F5" opacity=".9" />
          <rect x="30" y="34" width="28" height="4" rx="2" fill="#F5F5F5" opacity=".6" />
        </svg>
      )
    case 'buried':
      return (
        <svg viewBox="0 0 200 90" aria-hidden className="absolute -bottom-[2%] left-[2%] w-[96%]">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={18 + (i % 2) * 8 - i * 2}
              y={78 - i * 13}
              width={164 - (i % 3) * 6}
              height="14"
              rx="2"
              fill={i % 2 ? '#F5F5F5' : '#E4E4E4'}
              stroke="#0C0C0F"
              strokeWidth="3"
              transform={`rotate(${(i % 2 ? 1 : -1) * (i + 1)} 100 ${84 - i * 13})`}
            />
          ))}
        </svg>
      )
    case 'stamp':
      return (
        <svg viewBox="0 0 70 80" aria-hidden className="absolute top-[38%] left-[2%] w-[28%] -rotate-12">
          <rect x="24" y="4" width="22" height="34" rx="8" fill="#202027" stroke="#0C0C0F" strokeWidth="4" />
          <rect x="6" y="38" width="58" height="18" rx="3" fill="#17171C" stroke="#0C0C0F" strokeWidth="4" />
          <rect x="4" y="58" width="62" height="14" rx="2" fill="#FF6B6B" stroke="#0C0C0F" strokeWidth="4" />
        </svg>
      )
    case 'shocked':
      return (
        <svg viewBox="0 0 60 60" aria-hidden className="absolute top-[2%] right-[6%] w-[22%]">
          <path d="M14 6 20 34M34 4 32 32" stroke="#FF6B6B" strokeWidth="7" strokeLinecap="round" />
          <circle cx="21" cy="47" r="5" fill="#FF6B6B" />
          <circle cx="32" cy="45" r="5" fill="#FF6B6B" />
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
