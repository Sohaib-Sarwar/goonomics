import { useState } from 'react'
import type { RankBadge } from '../lib/badges'

/** A rank badge emblem: Higgsfield art with a styled fallback. The name is always live text. */
export function BadgeEmblem({ badge, className = '', locked = false }: { badge: RankBadge; className?: string; locked?: boolean }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`relative shrink-0 ${className} ${locked ? 'opacity-35 grayscale' : ''}`} aria-hidden>
      {failed ? (
        <div className="grid h-full w-full place-items-center rounded-full border-4" style={{ borderColor: badge.tone, background: `radial-gradient(circle, ${badge.tone}55, transparent 70%)` }}>
          <div className="h-1/3 w-1/3 rounded-full" style={{ background: badge.tone }} />
        </div>
      ) : (
        <img src={badge.art} alt="" width={256} height={256} decoding="async" onError={() => setFailed(true)} className="h-full w-full object-contain drop-shadow-[0_8px_18px_rgb(0_0_0/0.55)]" />
      )}
    </div>
  )
}
