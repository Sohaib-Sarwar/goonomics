import type { Reaction } from '../lib/copy/verdicts'
import { Bubble, ReactionArt } from './Mascot'

/**
 * The auditor reacting live to what is being entered. Phones get a compact row (art + bubble);
 * wider screens get a big reaction with the bubble above it.
 */
export function LiveCommentary({ comment, reaction, layout }: { comment: string; reaction: Reaction; layout: 'row' | 'stack' }) {
  if (layout === 'row') {
    return (
      <div className="flex items-center gap-2.5 md:hidden">
        <ReactionArt reaction={reaction} className="h-[clamp(3rem,10vh,6rem)] w-[clamp(3rem,10vh,6rem)] shrink-0" />
        <Bubble live tail="left" className="min-w-0 flex-1">
          {comment}
        </Bubble>
      </div>
    )
  }
  return (
    <div className="hidden min-w-0 flex-col items-center gap-4 md:flex">
      <Bubble live>{comment}</Bubble>
      <ReactionArt reaction={reaction} className="aspect-square h-[clamp(9rem,38vh,20rem)] max-w-full flat:hidden" />
    </div>
  )
}
