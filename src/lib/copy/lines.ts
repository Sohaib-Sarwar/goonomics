import type { Band } from './verdicts'

/**
 * Every visitor facing string that is not a roast or verdict. Short, conversational, no hyphens or
 * dashes (a test enforces it). Slang is seasoning: placed where the joke needs it.
 */

export type LoadingStage = 'open' | 'middle' | 'close'

export const LOADING: { stage: LoadingStage; text: string }[] = [
  { stage: 'open', text: 'Checking the forbidden archives' },
  { stage: 'open', text: 'Pulling receipts from the lore vault' },
  { stage: 'open', text: 'Warming up the official stamp' },
  { stage: 'middle', text: 'The spreadsheet is fighting for its life' },
  { stage: 'middle', text: 'Consulting scientists who did not need to know this' },
  { stage: 'middle', text: 'The Biology Department has left the group chat' },
  { stage: 'middle', text: 'Your alternate timeline is under investigation' },
  { stage: 'middle', text: 'Counting swimmers. Not babies. Swimmers.' },
  { stage: 'middle', text: 'Asking the council for a ruling' },
  { stage: 'middle', text: 'Cross checking with the WHO tables' },
  { stage: 'middle', text: 'The intern is crying. This is normal.' },
  { stage: 'middle', text: 'Converting minutes into unread books' },
  { stage: 'middle', text: 'Calculating the generational fumble' },
  { stage: 'middle', text: 'Letting the algorithm cook' },
  { stage: 'middle', text: 'Applying the leap year correction nobody asked for' },
  { stage: 'middle', text: 'Locking in. The auditor, not you.' },
  { stage: 'middle', text: 'Checking if this counts as a canon event' },
  { stage: 'middle', text: 'Peer review requested. Peers declined.' },
  { stage: 'middle', text: 'Removing the rage bait from the results' },
  { stage: 'middle', text: 'Writing your patch notes' },
  { stage: 'middle', text: 'Estimating aura debt' },
  { stage: 'middle', text: 'Chat is reviewing the evidence' },
  { stage: 'middle', text: 'The math is mathing. Reluctantly.' },
  { stage: 'close', text: 'Running the final aura assessment' },
  { stage: 'close', text: 'Preparing the allegations' },
]

/** The joke is that sperm cells are not a baby inventory, and that is also the science. */
export const BIOLOGY: string[] = [
  'Little swimmers counted. Imaginary babies not found.',
  'Bro tried to convert cells into children. Biology said absolutely not.',
  'The fertilization department has denied your refund.',
  'Sperm cells are cells. Not a baby inventory.',
  'One egg. One winner. Everyone else was just the crowd.',
  'Counting sperm as kids is like counting lottery tickets as mansions.',
  'No egg was involved in the making of this statistic.',
  'Kids wasted: zero. Biology closed the case.',
  'The swimmers had one job interview, and it was never scheduled.',
  'Cells are cells. Kids are kids. The council has ruled.',
  'Calling these future children is the rage bait of biology.',
  'One cell, one tail, big dreams. That is the whole résumé.',
  'Biology would like to finish its sentence before you panic.',
  'Nobody was wasted. Some cells just had a very short career.',
  'The Department of Fertilization was not consulted and is fine with that.',
]

/** Alternate timeline lines keyed by activity id. {count} is pre-formatted. */
export const TIME_LINES: Record<string, string> = {
  tutorial: '{count} productivity tutorials, abandoned halfway. Very on brand.',
  novel: '{count} novels. Your reading list would be terrifying.',
  lesson: '{count} coding lessons. You would be shipping apps instead of lore.',
  language: '{count} language lessons. Fluent in something besides brainrot.',
  sitcom: '{count} sitcom episodes. Same show. Again.',
  drama: '{count} prestige drama episodes. Spoilers included.',
  pomodoro: '{count} study sessions. The tomato timer is crying.',
  film: '{count} movies. Absolute cinema, the real kind.',
  trilogy: '{count} extended trilogy marathons. Second breakfast included.',
  marathon: '{count} actual marathons. Legs not included.',
  gym: '{count} gym sessions. The gains would be unreal.',
  podcast: '{count} podcast episodes. Still not enough to explain this.',
  guitar: '{count} guitar sessions. Your covers would go crazy.',
  nap: '{count} power naps. Honestly, similar outcome.',
  flight: '{count} flights from London to New York. Window seat every time.',
  workweek: '{count} full work weeks. An internship and a crash out.',
}

export const TIME_LEAD = 'Your alternate timeline finished {count} {label}, assuming {each} each. Whether you would have is between you and the council.'

export const SHARE_CTAS = ['Drop this in the GC', 'Send the allegations', 'Your bro is next', 'Let the council rate you']

export const INVITE = 'Bro, I got audited by GOONOMICS. Drop your lore and let us compare allegations.'

/** Short captions for Stories and posts, by band plus a general pool. */
export const CAPTIONS: Record<Band | 'any', string[]> = {
  any: [
    'New lore just dropped.',
    'The council is NOT letting this slide.',
    'Proof that I need a different side quest.',
    'Tag the friend who needs this audit.',
    'It is so over. Or we are so back. Unclear.',
    'Chat, is this real? Asking for a friend.',
    'Got audited by a tiny lab creature. Would not recommend. Would recommend.',
    'Patch notes available upon request.',
    'The allegations have been formally filed.',
    'Your turn. The council is waiting.',
  ],
  zero: ['Clean record. Touch grass champion.', 'The council found nothing. Suspicious.'],
  low: ['Minor lore. Major aura.', 'Barely cooked and proud of it.'],
  mid: ['The lore runs deep and so does the spreadsheet.', 'This calculator knows way too much about me.'],
  high: ['Absolute cinema, and I am the cinema.', 'Let him cook? He cooked.'],
  max: ['Final boss energy, officially documented.', 'The council has blocked me.'],
}

/** Mascot speech bubbles on the input steps. */
export const LORE_BUBBLES = {
  empty: 'Two numbers. That is all I need.',
  zero: 'The lore starts today? Bold.',
  short: 'Short lore. Efficient.',
  medium: '{years} years of lore. The archive is warming up.',
  long: '{years} years? Get the big filing cabinet.',
}

export const RECEIPT_BUBBLES = {
  empty: 'Slide it. Nobody is watching. Except me.',
  zero: 'Zero? The council will verify that.',
  low: 'Casual. The spreadsheet can breathe.',
  mid: 'Oh. Okay. Writing that down.',
  high: 'I need a bigger clipboard.',
}

export const MICROCOPY = {
  stepLore: 'The lore',
  stepReceipts: 'The receipts',
  stepCooked: 'Get cooked',

  loreTitle: 'The council wants a word.',
  loreSub: 'Your lore. Your losses. No refunds.',
  loreHelp: 'Be honest. The spreadsheet cannot snitch.',
  currentAge: 'Current age',
  currentAgeHint: 'Adults only. Whole years.',
  startAge: 'Where the lore began',
  startAgeHint: 'The age it started. Rough guess is fine.',
  loreNext: 'Next: drop the receipts',

  receiptsTitle: 'Drop the receipts.',
  receiptsSub: 'Rough averages. Nobody remembers exact numbers, and it would be weird if you did.',
  daily: 'Average daily side quests',
  dailyHint: 'On a normal day',
  peakDays: 'Peak down bad days',
  peakDaysHint: 'Per year',
  peakRate: 'Side quests on those days',
  peakRateHint: 'Per day',
  lockedDays: 'Days you were actually locked in',
  lockedDaysHint: 'Zero activity days per year. Exams, monk mode, family trips.',
  heat: 'How cooked do you want to be?',
  heatHint: 'Changes the roast, not the math.',
  nerdSettings: 'Nerd settings',
  nerdSettingsHint: 'Session length, eras, science presets, calories',
  sessionLength: 'Average session length',
  eras: 'Split the lore into eras',
  erasHelp: 'Different eras, different energy. Years outside every era count as zero.',
  addEra: 'Add an era',
  suggestEras: 'Split my ages for me',
  removeEra: 'Remove era',
  preset: 'Science preset',
  calories: 'Add a calorie guess',
  caloriesHelp: 'Nobody has measured this. If you add it, the number is your guess and we label it that way.',
  lockedRate: 'Not fully locked in on those days?',
  receiptsNext: 'Show me the damage',
  receiptsBack: 'Go back to my lore',

  loadingTitle: 'Auditing',
  skip: 'Skip the drama',
  loadingNote: 'The math finished instantly on your device. This part is just theatre.',

  tabDamage: 'The damage',
  tabSwimmers: 'The swimmers',
  tabSideQuest: 'The side quest',
  tabAllegations: 'The allegations',
  editReceipts: 'Edit my receipts',
  startOver: 'Start over',
  newRoast: 'New roast',
  gci: 'GOI',
  goiLong: 'The Goonomics Index',
  goiNote: 'A made up score from 300 to 850. Fun only.',
  achievements: 'Unlocked',
  noDiagnosis: 'Entertainment estimates from your own guesses. Not a diagnosis. If it ever feels out of control, talk to a professional.',

  storyMode: 'Story mode',
  squareMode: 'Square mode',
  copyRoast: 'Copy the roast',
  shareLore: 'Share the lore',
  download: 'Download the meme',
  copyCaption: 'Copy caption',
  newCaption: 'New caption',
  whatsapp: 'Send on WhatsApp',
  copiedRoast: 'Roast copied. Use responsibly.',
  copiedCaption: 'Caption copied. Go post it.',
  downloaded: 'Meme saved. Post it before you overthink it.',
  shared: 'Shared. The council thanks you.',
  shareFailed: 'Your browser said no. Download it instead.',
  rendering: 'Cooking the image',
  cardStat: 'Big number on the card',
  cardPrivacy: 'Your age and answers never go on the card.',

  compareTitle: 'Rate your friend',
  compareHelp: 'Type the GOI from their card. Nothing gets saved or sent.',
  compareLabel: 'Their GOI',
  compareRun: 'Compare',

  infoButton: 'How we cooked the numbers',
  close: 'Close',
  imageFallback: 'The auditor stepped out. The math did not.',

  ageGateTitle: 'Adults only past this point.',
  ageGateBody:
    'GOONOMICS is a comedy calculator about self reported masturbation stats. Not explicit, but adults only. We do not check ID and nothing leaves this tab.',
  ageGateYes: 'I am 18 or older',
  ageGateNo: 'Take me somewhere wholesome',
  ageGateDeclinedTitle: 'Respect. Truly.',
  ageGateDeclinedBody: 'Go touch some grass and come back when you are 18. The spreadsheet will wait.',
  ageGateMisclick: 'Wait, I misclicked',

  cardKicker: 'The council has decided.',
  cardCta: 'Get audited',
  cardDisclaimer: 'Entertainment estimate from self reported guesses. Cells are not kids. Not medical advice.',
}

/** Head to head verdicts, by score difference (you minus them). */
export function compareLine(diff: number): string {
  if (diff >= 120) return 'Not even close. Your lore is heavier. Congrats, sort of.'
  if (diff >= 40) return 'You out lored them. Nobody wins here, but you win more.'
  if (diff > 0) return 'Neck and neck, and you edge it. Lore twins, basically.'
  if (diff === 0) return 'Identical scores. The council demands a recount.'
  if (diff > -40) return 'Neck and neck, and they edge it. Respectfully, close call.'
  if (diff > -120) return 'They out lored you. Their spreadsheet is in worse shape.'
  return 'They are in a different league. Send them a glass of water.'
}
