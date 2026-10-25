import { ArrowDown, ArrowRight, Play } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { ASSETS, STICKERS } from '../lib/assets'
import { LANDING } from '../lib/copy/lines'
import { QR_SRC } from '../lib/site'
import { Bubble, Mascot, ReactionArt, Stamp } from './Mascot'
import { FitBox, GhostButton, PrimaryButton, Sheet } from './ui'

/** First screen: the hook, the auditor, and the three step explainer. Fits one viewport. */
export function Landing({ onStart }: { onStart: () => void }) {
  const [how, setHow] = useState(false)
  return (
    <section aria-labelledby="landing-title" className="relative isolate flex h-full min-h-0 flex-col">
      <img src={ASSETS.hero.src} srcSet={ASSETS.hero.srcSet} sizes="100vw" alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-[78%_center] opacity-30" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0c0c0f_20%,#0c0c0fcc_60%,#0c0c0f88_100%)]" />

      <div className="scroll-quiet min-h-0 flex-1">
        <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center gap-[clamp(0.75rem,3vh,2.5rem)] px-4 py-3 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:gap-8">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-mono text-[0.7rem] text-muted sm:text-xs">
                <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-lime shadow-[0_0_10px_#c5ff5c]" />
                Case file open
              </p>
              <h1
                id="landing-title"
                className="mt-2 font-display text-[clamp(2.4rem,min(11vw,9.5vh),6.6rem)] leading-[0.86] font-black tracking-[-0.015em] text-balance uppercase"
              >
                {LANDING.title}
              </h1>
              <p className="mt-3 max-w-md text-[clamp(0.95rem,2.2vh,1.25rem)] text-paper/85">{LANDING.sub}</p>
              <div className="mt-5 hidden flex-wrap gap-3 md:flex">
                <PrimaryButton onClick={onStart}>{LANDING.cta}</PrimaryButton>
                <GhostButton onClick={() => setHow(true)} className="inline-flex items-center gap-2">
                  <Play size={16} aria-hidden /> {LANDING.how}
                </GhostButton>
              </div>
            </div>
            <div className="flex w-[34vw] max-w-[22rem] min-w-[7rem] flex-col items-center md:w-auto">
              <div className="hidden w-full justify-center sm:flex">
                <Bubble>{LANDING.bubble}</Bubble>
              </div>
              <div className="relative mt-3 aspect-square h-[clamp(7rem,30vh,20rem)] max-w-full">
                <Mascot className="h-full w-full" eager />
                <ReactionArt reaction="cry" className="absolute -right-[6%] -bottom-[4%] h-[42%] w-[42%]" />
              </div>
            </div>
          </div>

          <HowStrip onStart={onStart} />
        </div>
      </div>

      <div className="shrink-0 border-t border-line bg-ink/95 backdrop-blur md:hidden">
        <div className="flex gap-2 px-4 py-2.5">
          <GhostButton onClick={() => setHow(true)} className="inline-flex shrink-0 items-center gap-1.5 text-sm" label={LANDING.how}>
            <Play size={15} aria-hidden /> How
          </GhostButton>
          <PrimaryButton onClick={onStart} className="flex-1">
            {LANDING.cta}
          </PrimaryButton>
        </div>
      </div>

      <Sheet open={how} onClose={() => setHow(false)} title={LANDING.stepsTitle} wide>
        <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {LANDING.steps.map((s, i) => (
            <StepTile key={s.title} index={i} big />
          )).flatMap((el, i) => (i < 2 ? [el, <Arrow key={`a${i}`} big />] : [el]))}
        </div>
        <div className="mt-5 flex justify-center">
          <PrimaryButton
            onClick={() => {
              setHow(false)
              onStart()
            }}
          >
            {LANDING.afterSteps}
          </PrimaryButton>
        </div>
      </Sheet>
    </section>
  )
}

/** Compact three step illustration under the hero. Phones hide on short screens; labels stay. */
function HowStrip({ onStart }: { onStart: () => void }) {
  return (
    <div aria-label={LANDING.stepsTitle} className="rounded-2xl border border-line bg-panel/70 p-3 backdrop-blur-sm sm:p-4">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto]">
        <StepTile index={0} />
        <Arrow />
        <StepTile index={1} />
        <Arrow />
        <StepTile index={2} />
        <div className="hidden md:block">
          <PrimaryButton onClick={onStart} className="whitespace-nowrap">
            {LANDING.afterSteps}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function StepTile({ index, big = false }: { index: number; big?: boolean }) {
  const s = LANDING.steps[index]!
  const Screen = [MockReceipts, MockAudit, MockCard][index]!
  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <FitBox width={200} height={400} className={big ? 'h-[min(46vh,22rem)] w-full' : 'h-[clamp(0px,calc(28vh-4rem),15rem)] w-full short:h-[clamp(0px,calc(22vh-3rem),11rem)] tiny:hidden'}>
        <Phone>
          <Screen />
        </Phone>
      </FitBox>
      <p className={`mt-1.5 font-display leading-none font-black uppercase ${big ? 'text-2xl' : 'text-[clamp(0.85rem,3.4vw,1.35rem)]'}`}>
        <span className="tabular font-mono text-lime">{index + 1}</span> {s.title}
      </p>
      <p className={`mt-1 text-muted ${big ? 'text-sm' : 'hidden text-xs lg:block'}`}>{s.body}</p>
    </div>
  )
}

function Arrow({ big = false }: { big?: boolean }) {
  return (
    <>
      <ArrowRight aria-hidden className={`text-lime ${big ? 'hidden sm:block' : ''}`} size={big ? 28 : 20} />
      {big && <ArrowDown aria-hidden className="mx-auto text-lime sm:hidden" size={24} />}
    </>
  )
}

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[400px] w-[200px] rounded-[30px] border-[6px] border-[#2a2a33] bg-ink p-2 shadow-[0_20px_50px_rgb(0_0_0/0.6)]">
      <div aria-hidden className="absolute top-1.5 left-1/2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-[#2a2a33]" />
      <div className="flex h-full flex-col overflow-hidden rounded-[22px] bg-ink pt-4">{children}</div>
    </div>
  )
}

function MiniSlider({ label, value, fill }: { label: string; value: string; fill: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[9px] font-semibold">
        <span>{label}</span>
        <span className="rounded border border-line-strong px-1 font-mono">{value}</span>
      </div>
      <div className="relative mt-1.5 h-1 rounded-full bg-line-strong">
        <div className="h-full rounded-full bg-lime" style={{ width: `${fill}%` }} />
        <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-lime bg-paper" style={{ left: `${fill}%` }} />
      </div>
    </div>
  )
}

function MockReceipts() {
  return (
    <div className="flex h-full flex-col gap-3 px-3">
      <div className="flex justify-center gap-1">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`grid h-4 w-4 place-items-center rounded-full border text-[7px] font-bold ${n === 1 ? 'border-lime bg-lime text-ink' : n === 2 ? 'border-lime text-lime' : 'border-line-strong text-faint'}`}>
            {n}
          </span>
        ))}
      </div>
      <p className="font-display text-[22px] leading-none font-black uppercase">Drop the receipts.</p>
      <MiniSlider label="Daily side quests" value="0.8" fill={22} />
      <MiniSlider label="Peak down bad days" value="40" fill={14} />
      <MiniSlider label="Locked in days" value="25" fill={9} />
      <div className="grid grid-cols-3 gap-0.5 rounded-md border border-line-strong p-0.5 text-[7px] font-semibold">
        <span className="py-1 text-center text-muted">Light</span>
        <span className="rounded bg-lime py-1 text-center text-ink">Medium</span>
        <span className="py-1 text-center text-muted">Burnt</span>
      </div>
      <div className="rounded-lg bg-paper px-2 py-1.5 text-[8px] leading-tight font-semibold text-ink">Daily ritual. The council respects consistency.</div>
      <div className="mt-auto mb-3 rounded-lg bg-lime py-2 text-center font-display text-[13px] font-extrabold text-ink uppercase">Show me the damage</div>
    </div>
  )
}

function MockAudit() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-3">
      <p className="font-display text-[24px] font-black uppercase">
        Auditing<span className="text-lime">.</span>
      </p>
      <img src={STICKERS.inspect.src} alt="" className="h-28 w-28 object-contain" />
      <div className="w-full">
        <div className="flex justify-between font-mono text-[8px] text-muted">
          <span>Audit progress</span>
          <span className="text-lime">66%</span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-line">
          <div className="h-full w-2/3 rounded-full bg-lime" />
        </div>
      </div>
      <p className="text-center text-[10px] font-semibold">The spreadsheet is fighting for its life</p>
    </div>
  )
}

function MockCard() {
  return (
    <div className="grid-paper flex h-full flex-col px-3 pb-3">
      <p className="font-display text-[15px] leading-none font-black">
        G<span className="text-lime">OO</span>NOMICS
      </p>
      <p className="mt-2 font-mono text-[7px] text-lime">The council has decided.</p>
      <p className="font-display text-[22px] leading-[0.9] font-black uppercase">The lore archivist</p>
      <div className="relative mx-auto mt-1 h-24 w-24">
        <img src={STICKERS.cry.src} alt="" className="h-full w-full object-contain" />
        <Stamp size="sm" className="absolute -right-6 bottom-1 !text-[9px]">
          Cooked
        </Stamp>
      </div>
      <p className="mt-1 font-mono text-[18px] leading-none text-lime">
        GOI <span className="text-paper">612</span>
      </p>
      <p className="mt-1 border-l-2 border-lime pl-1.5 font-display text-[10px] leading-tight font-bold">“The calculator has no right knowing this much.”</p>
      <div className="mt-auto flex items-center gap-2">
        <img src={QR_SRC} alt="" className="h-10 w-10 rounded bg-white p-0.5" style={{ imageRendering: 'pixelated' }} />
        <p className="font-display text-[9px] leading-tight font-black uppercase">Scan to get your own audit</p>
      </div>
    </div>
  )
}
