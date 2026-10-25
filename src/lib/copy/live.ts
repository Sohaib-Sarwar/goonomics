import type { Heat } from './roasts'
import { OVER_LIMIT_SHORT, parseNumber } from '../validate'

/**
 * Live commentary: the auditor reacts to whatever is being typed or slid, right now.
 * Every field maps value ranges to a small pool; the pick is stable for a given value, so the
 * line only changes when the number does. Spicy, never graphic, never about bodies or health.
 */
export type LiveField = 'currentAge' | 'startAge' | 'normalPerDay' | 'peakDaysPerYear' | 'peakPerDay' | 'offDaysPerYear' | 'heat' | 'minutes'

const pickBy = (pool: string[], n: number) => pool[Math.abs(Math.round(n * 10)) % pool.length]!
const fill = (s: string, n: number) => s.replace('{n}', String(Math.round(n * 10) / 10))

const LINES = {
  currentAge: {
    empty: ['Age first. The council needs context.'],
    minor: ['Nope. Come back after your birthday arc.', 'Under 18? The council said absolutely not.'],
    young: ['Fresh lore. Still in the tutorial era.', 'Freshman energy. The archive is basically empty.', 'Barely unlocked the game and already here. Bold.'],
    twenties: ['Prime side quest years. Interesting.', 'Main character age. Let us see the receipts.', 'Peak delulu years. The council is listening.'],
    thirties: ['Thirties. The lore has sequels now.', 'Unc status loading.', 'The lore has an extended cut at this point.'],
    unc: ['Certified unc. Respect the archive.', 'This lore has DLC, season passes, everything.', 'Unc mode. The council stands up when you enter.'],
    legend: ['Legend. The council is taking notes from you.', 'This lore predates the internet. Respect.'],
  },
  startAge: {
    empty: ['When did the lore drop? Rough guess is fine.'],
    future: ['Time travel is not supported. Yet.'],
    zero: ['The lore starts today? Bold launch.'],
    short: ['Short lore. Efficient. Suspicious.', '{n} years. Still in the free trial.'],
    medium: ['{n} years of lore. The filing cabinet is warming up.', '{n} years. The intern just opened a second drawer.'],
    long: ['{n} years?? We need the big filing cabinet.', '{n} years of lore. This is a whole franchise.'],
    epic: ['{n} years. This lore has a fandom wiki.', '{n} years. Generational lore, honestly.'],
  },
  normalPerDay: {
    empty: ['Slide it. Nobody is watching. Except me.'],
    zero: ['Zero? Monk mode or lying to a calculator. We will see.', 'Zero. The council does not believe you, but okay.'],
    rare: ['Once in a blue moon. Touch grass champion.', 'Barely any. Is this a calculator or a confession of innocence?'],
    weekly: ['A few times a week. Casual side quester behavior.', 'Weekly vibes. Respectable. Boring, but respectable.'],
    daily: ['Daily ritual. The council respects consistency.', 'Once a day keeps the spreadsheet busy.', 'Daily? Locked in, just on the wrong thing.'],
    more: ['More than daily. Okay, let him cook.', 'Above daily. The spreadsheet just sat up.'],
    lots: ['Multiple a day?? The spreadsheet started sweating.', '{n} a day. Bro has a schedule for this.', 'That is not a habit, that is a part time job.'],
    wild: ['{n} a day. The council needs a minute.', 'Bro is speedrunning the lore.', 'At {n} a day the intern quit. On the spot.'],
    extreme: ['{n} a day?? Medically we are fine. Emotionally the spreadsheet is not.', 'Final boss numbers. The council is calling a meeting.'],
    over: [OVER_LIMIT_SHORT],
  },
  peakDaysPerYear: {
    zero: ['No peak days. Suspiciously stable.', 'Zero peak days. Emotionally regulated king.'],
    few: ['A few spicy days a year. Seasonal lore.', '{n} peak days. A limited edition drop.'],
    some: ['{n} peak days. That is a whole season of down bad.', '{n} days of peak. The council noticed.'],
    lots: ['{n} peak days?? That is not a peak, that is a plateau.', 'Peak season runs longer than most TV shows.'],
    most: ['Half the year is peak season. The calendar is crying.', '{n} peak days. The peak is the personality now.'],
  },
  peakPerDay: {
    low: ['Peak day, mild heat. Respectable.', 'Peak day energy, but polite about it.'],
    mid: ['{n} on a peak day. The intern needs a nap.', 'Peak days hit {n}. Crash out recorded.'],
    high: ['{n} on peak days. Bro was not having a day, he was having a saga.', '{n}?? That is a director cut of a day.'],
    over: [OVER_LIMIT_SHORT],
  },
  offDaysPerYear: {
    zero: ['Zero locked in days. Never logged off, huh.', 'No days off. The archive never sleeps.'],
    few: ['A few days off. Exam season, probably.', '{n} days locked in. A small discipline arc.'],
    some: ['{n} locked in days. Discipline arc unlocked.', '{n} days of monk mode. Character development.'],
    lots: ['{n} days locked in. Monk mode main character.', 'Locked in for {n} days. Aura farming, but make it focus.'],
    most: ['Locked in most of the year. Okay, monk.', '{n} days locked in. Who is this disciplined? Seriously.'],
  },
  heat: {
    light: ['Lightly cooked. We will be gentle. Mostly.'],
    medium: ['Medium rare. Seasoned, not scorched.'],
    burnt: ['Burnt to a crisp. You asked for this. No take backs.'],
  },
  minutes: {
    5: ['Five minutes. Efficient. Suspiciously efficient.'],
    10: ['Ten minutes. A respectable coffee break.'],
    15: ['Fifteen minutes. Standard issue.'],
    30: ['Thirty minutes. That is a whole episode, bro.'],
  },
} as const

export function liveComment(field: LiveField, raw: string, ctx: { currentAge?: string; heat?: Heat } = {}): string {
  const p = parseNumber(raw)
  const n = p.ok ? p.value : NaN
  switch (field) {
    case 'currentAge': {
      const L = LINES.currentAge
      if (!p.ok) return L.empty[0]
      const pool = n < 18 ? L.minor : n < 22 ? L.young : n < 30 ? L.twenties : n < 40 ? L.thirties : n < 60 ? L.unc : L.legend
      return pickBy([...pool], n)
    }
    case 'startAge': {
      const L = LINES.startAge
      const cur = parseNumber(ctx.currentAge ?? '')
      if (!p.ok || !cur.ok) return L.empty[0]
      const years = cur.value - n
      if (years < 0) return L.future[0]
      if (years === 0) return L.zero[0]
      const pool = years < 5 ? L.short : years < 15 ? L.medium : years < 30 ? L.long : L.epic
      return fill(pickBy([...pool], years), years)
    }
    case 'normalPerDay': {
      const L = LINES.normalPerDay
      if (!p.ok) return L.empty[0]
      if (n > 17) return L.over[0]
      const pool = n <= 0 ? L.zero : n < 0.3 ? L.rare : n < 0.75 ? L.weekly : n < 1.25 ? L.daily : n < 2 ? L.more : n < 4 ? L.lots : n < 10 ? L.wild : L.extreme
      return fill(pickBy([...pool], n), n)
    }
    case 'peakDaysPerYear': {
      const L = LINES.peakDaysPerYear
      if (!p.ok || n <= 0) return pickBy([...L.zero], 0)
      const pool = n < 15 ? L.few : n < 60 ? L.some : n < 150 ? L.lots : L.most
      return fill(pickBy([...pool], n), n)
    }
    case 'peakPerDay': {
      const L = LINES.peakPerDay
      if (!p.ok) return L.low[0]
      if (n > 17) return L.over[0]
      const pool = n <= 2 ? L.low : n <= 5 ? L.mid : L.high
      return fill(pickBy([...pool], n), n)
    }
    case 'offDaysPerYear': {
      const L = LINES.offDaysPerYear
      if (!p.ok || n <= 0) return pickBy([...L.zero], n || 0)
      const pool = n < 30 ? L.few : n < 120 ? L.some : n < 250 ? L.lots : L.most
      return fill(pickBy([...pool], n), n)
    }
    case 'heat':
      return LINES.heat[ctx.heat ?? 'medium'][0]
    case 'minutes': {
      const key = String(n) as '5' | '10' | '15' | '30'
      return (LINES.minutes as Record<string, readonly string[]>)[key]?.[0] ?? 'Custom length. The council respects the precision.'
    }
  }
}

/** Every line, for the copy tests. */
export const ALL_LIVE_LINES: string[] = Object.values(LINES).flatMap((g) => Object.values(g).flatMap((pool) => [...(pool as readonly string[])]))
