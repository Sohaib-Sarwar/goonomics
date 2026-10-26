import type { Band } from './verdicts'

/**
 * Every visitor facing string that is not a roast, verdict or live comment. Short, conversational,
 * no hyphens or dashes (a test enforces it). Slang is seasoning: placed where the joke needs it.
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
  { stage: 'middle', text: 'The swimmers are lawyering up' },
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

/** Crying swimmer meme captions. The absurd part is the baby math, never the cells. */
export const SWIMMER_LINES: string[] = [
  'The little swimmers have filed a complaint.',
  'The imaginary daycare is in shambles.',
  'The council counted the swimmers. Biology denied the baby math.',
  'The swimmers are crying. The science department is facepalming.',
  'Bro tried to turn cells into children. Biology said no.',
  'The swimmers unionized. Their demand: stop calling them babies.',
  'Breaking: zero daycares were harmed in this calculation.',
  'The baby math failed peer review. Spectacularly.',
  'Swimmer HR is overwhelmed. Please hold.',
  'The swimmers saw the number and started crying in 4K.',
]

export const REALITY_CHECK = 'Reality check: sperm cells are single cells, not babies. Only one can fertilize an egg, and only if an egg is there. No daycare was ever involved.'

export const SHARE_CTAS = ['Drop this in the GC', 'Send the allegations', 'Tag your final boss', 'Let your friends cook']

export const INVITE = 'Bro, I got audited by GOONOMICS. Drop your lore and let us compare allegations.'

/** Short captions, by band plus a general pool. "POV" score reveals are a current format. */
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
    'POV: the council just read my file.',
    'POV: you asked a calculator for honesty.',
    'Who is more cooked? Prove me wrong.',
  ],
  zero: ['Clean record. Touch grass champion.', 'The council found nothing. Suspicious.'],
  low: ['Minor lore. Major aura.', 'Barely cooked and proud of it.'],
  mid: ['The lore runs deep and so does the spreadsheet.', 'This calculator knows way too much about me.'],
  high: ['Absolute cinema, and I am the cinema.', 'Let him cook? He cooked.'],
  max: ['Final boss energy, officially documented.', 'The council has blocked me.'],
}

/** Landing page and the three step explainer. */
export const LANDING = {
  title: 'Your lore. Under investigation.',
  sub: 'One calculator. Questionable statistics. Zero need to explain yourself.',
  cta: 'Run my audit',
  how: 'Show me how it works',
  stepsTitle: 'Three steps. Zero shame.',
  steps: [
    { title: 'Drop the lore', body: 'Ages and rough numbers. Sliders do the work.' },
    { title: 'Get the audit', body: 'The auditor crunches it. On your device.' },
    { title: 'Cook your friends', body: 'One card. A QR. The group chat does the rest.' },
  ],
  afterSteps: 'Let me cook',
  bubble: 'Be honest. Your spreadsheet cannot snitch.',
}

/** "Who is more cooked?" verdicts. Higher GOI means more cooked. Jokes target the audit, not people. */
export function versusLine(mine: number, theirs: number): { headline: string; line: string } {
  const diff = mine - theirs
  if (diff === 0) return { headline: 'It is a tie.', line: 'Both spreadsheets need help. The council demands a rematch.' }
  if (diff >= 150) return { headline: 'You are more cooked.', line: 'Not even close. The council has ruled in your favor. Sort of.' }
  if (diff >= 40) return { headline: 'You are more cooked.', line: 'The council has ruled in your favor. Your spreadsheet disagrees.' }
  if (diff > 0) return { headline: 'You edge it.', line: 'Basically lore twins. You win by a whisker and a spreadsheet.' }
  if (diff > -40) return { headline: 'They edge it.', line: 'Basically lore twins. They win by a whisker. Rematch energy.' }
  if (diff > -150) return { headline: 'Your friend is more cooked.', line: 'Your friend has been promoted to department head.' }
  return { headline: 'Your friend is way more cooked.', line: 'Different league. Send them a glass of water and a hug.' }
}

export const VERSUS = {
  title: 'Who is more cooked?',
  you: 'You',
  them: 'Your friend',
  help: 'Type the GOI from their card. Nothing is saved or sent.',
  label: 'Their GOI',
  run: 'Settle it',
  copy: 'Copy the verdict',
  copied: 'Verdict copied. Start the drama.',
  invalid: 'A GOI is a whole number from 300 to 850. Check their card.',
  fine: 'Fictional scores. Nobody here is unhealthy, just audited.',
  empty: 'Waiting for their number. The council is patient.',
}

/** The score manual. Same score for the same inputs; roast heat never touches it. */
export const SCORE_MANUAL = {
  title: 'So how cooked are you?',
  kicker: 'The score manual',
  formula: 'GOI = 300 + 550 × (75% how many sessions in total + 25% how often per day). Both are on a log scale, capped at 50,000 sessions and 4 a day.',
  same: 'Same inputs, same score. Roast heat changes the jokes, never the number.',
  disclaimer: 'Entertainment only. It does not measure health, habits, fertility, intelligence or personal worth.',
}

/** Card field labels for "What are we exposing?". */
export const EXPOSE = {
  title: 'What are we exposing?',
  all: 'Show all the receipts',
  reset: 'Recommended',
  fields: {
    goi: 'GOI score',
    badge: 'Rank badge',
    verdict: 'Verdict',
    sessions: 'Lifetime sessions',
    volume: 'Volume',
    swimmers: 'Swimmers',
    time: 'Time',
    xp: 'Brainrot XP',
    roast: 'The roast',
    achievement: 'Achievement',
  },
}

export const MICROCOPY = {
  monkLink: 'Monk Mode',
  monkHint: 'Want fewer side quests? Tarn is a calm, private habit companion.',
  planPrompt: 'You have seen the numbers. Ready to set your own direction?',
  planCta: 'Build my plan',
  planTitle: 'Build my plan in Tarn',
  planBody: 'Tarn is the calm side of GOONOMICS: a private habit companion where you choose what to change. Your GOI is just for fun and never decides anything there.',
  planAge: 'Bring my age range',
  planGoi: 'Bring my GOI as a note',
  planPrivacy: 'Only what you tick comes along, inside the link itself. It is never uploaded, and Tarn keeps it on your device.',
  planGo: 'Continue to Tarn',
  planFresh: 'Start fresh instead',
  stepLore: 'The lore',
  stepReceipts: 'The receipts',
  stepCooked: 'Get cooked',

  loreTitle: 'The council needs receipts.',
  loreSub: 'Your lore. Your losses. No refunds.',
  currentAge: 'Current age',
  currentAgeHint: 'Adults only. Whole years.',
  startAge: 'Where the lore began',
  startAgeHint: 'The age it started. Rough guess.',
  loreNext: 'Next: drop the receipts',

  receiptsTitle: 'Drop the receipts.',
  receiptsSub: 'Rough averages. Nobody remembers exact numbers.',
  daily: 'Average daily side quests',
  dailyHint: 'Normal day',
  peakDays: 'Peak down bad days',
  peakDaysHint: 'Per year',
  peakRate: 'Side quests on peak days',
  peakRateHint: 'Per day',
  lockedDays: 'Locked in days',
  lockedDaysHint: 'Zero activity days a year',
  heat: 'How cooked do you want to be?',
  heatHint: 'Changes the roast, not the math.',
  nerdSettings: 'Nerd settings',
  nerdSettingsHint: 'Session length, eras, science, calories',
  sessionLength: 'Average session length',
  eras: 'Split the lore into eras',
  erasHelp: 'Different eras, different energy. Years outside every era count as zero.',
  addEra: 'Add an era',
  suggestEras: 'Split my ages for me',
  removeEra: 'Remove era',
  preset: 'Science preset',
  calories: 'Add a calorie guess',
  caloriesHelp: 'Nobody has measured this. If you add it, it is labeled as your guess.',
  lockedRate: 'Not fully locked in on those days?',
  receiptsNext: 'Show me the damage',
  receiptsBack: 'Go back to my lore',
  done: 'Done',

  loadingTitle: 'Auditing',
  skip: 'Skip the drama',
  loadingNote: 'The math finished instantly on your device. This part is theater.',

  tabDamage: 'Damage',
  tabSwimmers: 'Swimmers',
  tabTimeline: 'Timeline',
  tabVersus: 'Versus',
  tabCard: 'The card',
  editReceipts: 'Edit my receipts',
  startOver: 'Start over',
  newRoast: 'New roast',
  goiLong: 'Goonomics Index',
  scoreManual: 'Score manual',
  achievements: 'Unlocked',
  noDiagnosis: 'Entertainment estimates from your own guesses. Not a diagnosis.',
  sessionsLabel: 'Lifetime sessions',
  timeLabel: 'Time invested',

  swimmersTitle: 'The swimmer ledger',
  swimmerCount: 'Swimmers, estimated',
  volume: 'Volume, estimated',
  receipts: 'See the receipts',

  timelineTitle: 'Bro, what could you have done instead?',
  timelineShort: 'The alternate timeline',
  timelineSub: 'Same hours, different arc. Imaginary, obviously.',
  tweak: 'Tweak the assumptions',
  scientist: 'Scientist arc: theoretically available. Actual motivation: not included.',
  fictional: 'fictional',

  download: 'Download the meme',
  shareReceipts: 'Share the receipts',
  copyRoast: 'Copy the roast',
  compareFriend: 'Compare with a friend',
  copyCaption: 'Copy caption',
  newCaption: 'New caption',
  whatsapp: 'WhatsApp',
  copiedRoast: 'Roast copied. Use responsibly.',
  copiedCaption: 'Caption copied. Go post it.',
  downloaded: 'Meme saved. Post it before you overthink it.',
  shared: 'Shared. The council thanks you.',
  shareFailed: 'Your browser said no. Download it instead.',
  rendering: 'Cooking the image',
  enlarge: 'Tap to enlarge',

  infoButton: 'How we cooked the numbers',
  close: 'Close',
  imageFallback: 'The auditor stepped out. The math did not.',

  ageGateTitle: 'Adults only past this point.',
  ageGateBody: 'GOONOMICS is a comedy calculator about self reported masturbation stats. Not explicit, but adults only. We do not check ID and nothing leaves this tab.',
  ageGateYes: 'I am 18 or older',
  ageGateNo: 'Take me somewhere wholesome',
  ageGateDeclinedTitle: 'Respect. Truly.',
  ageGateDeclinedBody: 'Go touch some grass and come back when you are 18. The spreadsheet will wait.',
  ageGateMisclick: 'Wait, I misclicked',

  cardKicker: 'The council has decided.',
  cardScan: 'Scan to get Cooked!',
  cardDisclaimer: 'For the memes, not med school. These stats are guesses, cells ain’t kids, and this is not medical advice. Bro, it is not that deep.',
  officialAudit: 'Official audit',
}
