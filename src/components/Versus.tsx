import { Copy, Share2 } from 'lucide-react'
import { useState } from 'react'
import { VERSUS, versusLine } from '../lib/copy/lines'
import { GOI_MAX, GOI_MIN, goiBand } from '../lib/goi'
import { canNativeShare, copyText, nativeShare } from '../lib/share'
import { SITE_URL } from '../lib/site'
import { parseNumber } from '../lib/validate'
import { ReactionArt } from './Mascot'

/**
 * "Who is more cooked?": your GOI against a friend's, typed in from their card. Local only.
 * Higher GOI means more cooked; the jokes target the audit, never the people.
 */
export function Versus({ goi }: { goi: number }) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const p = parseNumber(value)
  const valid = p.ok && Number.isInteger(p.value) && p.value >= GOI_MIN && p.value <= GOI_MAX
  const theirs = valid ? p.value : null
  const result = theirs !== null ? versusLine(goi, theirs) : null
  const invalid = value.trim() !== '' && !valid && value.trim().length >= 3

  const caption = result && theirs !== null ? `Who is more cooked? Me: GOI ${goi}. My friend: GOI ${theirs}. ${result.headline} ${result.line}\n${VERSUS.fine}\nRun yours: ${SITE_URL}` : ''

  const art = (side: 'me' | 'them') => {
    if (theirs === null) return side === 'me' ? 'inspect' : 'stare'
    if (goi === theirs) return 'paper'
    const meMore = goi > theirs
    return (side === 'me') === meMore ? 'cry' : 'cheer'
  }

  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-[clamp(0.5rem,2vh,1.25rem)]">
      <h2 className="text-center font-display text-[clamp(2rem,min(8vw,6vh),3.6rem)] leading-none font-black uppercase">{VERSUS.title}</h2>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-6">
        <div className="flex min-w-0 flex-col items-center text-center">
          <ReactionArt reaction={art('me')} className="h-[clamp(4.5rem,16vh,10rem)] w-[clamp(4.5rem,16vh,10rem)]" />
          <p className="mt-1 text-sm font-semibold text-muted">{VERSUS.you}</p>
          <p className="tabular font-mono text-[clamp(2.2rem,8vh,4rem)] leading-none font-medium text-lime">{goi}</p>
          <p className="mt-1 text-xs text-muted">{goiBand(goi)}</p>
        </div>
        <span className="font-display text-[clamp(1.6rem,5vh,3rem)] font-black text-coral">VS</span>
        <div className="flex min-w-0 flex-col items-center text-center">
          <ReactionArt reaction={art('them')} className="h-[clamp(4.5rem,16vh,10rem)] w-[clamp(4.5rem,16vh,10rem)]" />
          <label htmlFor="friendGoi" className="mt-1 text-sm font-semibold text-muted">
            {VERSUS.label}
          </label>
          <input
            id="friendGoi"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setStatus(null)
            }}
            inputMode="numeric"
            maxLength={3}
            placeholder="612"
            aria-invalid={invalid ? true : undefined}
            aria-describedby="friendGoi-help"
            className={`tabular w-full max-w-[9rem] rounded-xl border-2 bg-ink px-2 py-1 text-center font-mono text-[clamp(2rem,7vh,3.6rem)] leading-none text-paper focus:outline-none ${
              invalid ? 'border-coral' : 'border-line-strong focus:border-lime'
            }`}
          />
          <p className="mt-1 text-xs text-muted">{theirs !== null ? goiBand(theirs) : ' '}</p>
        </div>
      </div>

      <div role="status" aria-live="polite" className="mx-auto min-h-[4.5rem] w-full max-w-xl text-center">
        {invalid && <p className="font-semibold text-coral">{VERSUS.invalid}</p>}
        {!invalid && !result && <p className="text-muted">{VERSUS.help}</p>}
        {result && (
          <>
            <p className="font-display text-[clamp(1.6rem,5vh,2.8rem)] leading-none font-black text-balance uppercase motion-safe:animate-pop">{result.headline}</p>
            <p className="mt-1 font-semibold text-pretty">{result.line}</p>
          </>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-2">
        <div className="grid w-full grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!result}
            onClick={async () => setStatus((await copyText(caption)) ? VERSUS.copied : 'Copy failed. Your browser blocked the clipboard.')}
            className="press inline-flex items-center justify-center gap-1.5 rounded-xl bg-lime px-3 py-2.5 text-sm font-bold text-ink hover:bg-[#d4ff7f] disabled:opacity-40"
          >
            <Copy size={15} aria-hidden /> {VERSUS.copy}
          </button>
          {canNativeShare() ? (
            <button
              type="button"
              disabled={!result}
              onClick={async () => {
                const r = await nativeShare(caption, null)
                if (r === 'failed') setStatus('Sharing failed. Copy it instead.')
              }}
              className="press inline-flex items-center justify-center gap-1.5 rounded-xl border border-line-strong px-3 py-2.5 text-sm font-semibold hover:border-paper disabled:opacity-40"
            >
              <Share2 size={15} aria-hidden /> Share it
            </button>
          ) : (
            <p className="self-center text-xs text-faint">{VERSUS.fine}</p>
          )}
        </div>
        <p id="friendGoi-help" className="text-center text-xs text-faint">
          {status ?? (canNativeShare() ? VERSUS.fine : VERSUS.help)}
        </p>
      </div>
    </div>
  )
}
