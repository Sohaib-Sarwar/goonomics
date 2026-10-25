/**
 * Loading sequence, biology punchlines, time-comparison lines, share prompts and interface
 * microcopy. Slang is seasoning: current terms (lock in, cooked, crash out, aura, canon event,
 * unc, the council) appear where they fit, not in every line.
 */

export type LoadingStage = 'open' | 'middle' | 'close'

export const LOADING: { stage: LoadingStage; text: string }[] = [
  { stage: 'open', text: 'Initializing the Goon Archives…' },
  { stage: 'open', text: 'Sharpening the auditor’s tiny pencil…' },
  { stage: 'open', text: 'Brewing the fourth coffee of the night shift…' },
  { stage: 'open', text: 'Unlocking the filing cabinet nobody talks about…' },
  { stage: 'middle', text: 'Recovering deleted character-development arcs…' },
  { stage: 'middle', text: 'Auditing the down-bad database…' },
  { stage: 'middle', text: 'Consulting the Council of Unc Scholars…' },
  { stage: 'middle', text: 'Calculating the generational fumble…' },
  { stage: 'middle', text: 'Converting questionable decisions into spreadsheet cells…' },
  { stage: 'middle', text: 'The Biology Department has requested clarification…' },
  { stage: 'middle', text: 'Cross-referencing your lore with the WHO centile tables…' },
  { stage: 'middle', text: 'Asking the intern to stop laughing…' },
  { stage: 'middle', text: 'Separating swimmers from imaginary children…' },
  { stage: 'middle', text: 'Locking in. The auditor, not you…' },
  { stage: 'middle', text: 'Checking whether this counts as a canon event…' },
  { stage: 'middle', text: 'Converting minutes into unread novels…' },
  { stage: 'middle', text: 'Measuring aura loss to two decimal places…' },
  { stage: 'middle', text: 'Telling Excel it is going to be okay…' },
  { stage: 'middle', text: 'Redacting your age for legal reasons…' },
  { stage: 'middle', text: 'Peer-reviewing your choices. Peers declined…' },
  { stage: 'middle', text: 'Applying the leap-year correction nobody asked for…' },
  { stage: 'middle', text: 'Re-deriving the formula because the first one crashed out…' },
  { stage: 'middle', text: 'Removing the rage bait from the conclusions…' },
  { stage: 'middle', text: 'Waking up the Department of Fertilization…' },
  { stage: 'middle', text: 'Calibrating the brainrot meter…' },
  { stage: 'close', text: 'Running the final vibe check…' },
  { stage: 'close', text: 'Stamping things. Very official. Very loud…' },
  { stage: 'close', text: 'Generating your very unnecessary report…' },
  { stage: 'close', text: 'Your report is ready. Please contact absolutely nobody.' },
]

/** Biology punchlines. The joke is that sperm cells are not a baby inventory, and that is also the science. */
export const BIOLOGY: string[] = [
  'Potential kids wasted: biology says no.',
  'Your little swimmers have been counted. Your imaginary offspring have not.',
  'The Department of Fertilization refuses to recognize this statistic.',
  'Sperm cells are not a baby inventory.',
  'One egg, one winner, and the rest of the crowd goes home. Biology is brutal like that.',
  'Fertilization needs an egg, timing, and a long list of other things. A spreadsheet is not on the list.',
  'Counting sperm as kids is like counting lottery tickets as mansions.',
  'Millions start the race. One finishes, if there is even a race on. The rest were never kids. They were the crowd.',
  'No egg was involved in the making of this statistic.',
  'These swimmers had exactly one possible career path, and the job was never posted.',
  'The council voted. Cells are cells. Kids are kids. Motion carried.',
  'Imaginary children owed: zero. Biology has closed the claim.',
  'Calling these "potential kids" is the rage bait of reproductive science.',
  'A sperm cell is one cell with a tail and big dreams. That is the whole résumé.',
  'Your swimmers were never a population. They were a statistic. Now they are a big one.',
  'The Department of Fertilization would like it noted that it was not consulted.',
]

/** Time-comparison lines keyed by activity id. {count} is pre-formatted. */
export const TIME_LINES: Record<string, string> = {
  novel: '{count} novels at an average adult reading pace. Your book club would have been unstoppable.',
  lesson: '{count} beginner coding lessons. You would be shipping side projects instead of side quests.',
  language: '{count} bite-size language lessons. Fluent in at least one language besides brainrot.',
  sitcom: '{count} sitcom episodes. Rewatching the same show, as is tradition.',
  drama: '{count} prestige-drama episodes, plus the mid-season crash outs in the group chat.',
  pomodoro: '{count} pomodoro study blocks. The tomato timer weeps.',
  film: '{count} feature films. Absolute cinema, the actual kind.',
  trilogy: '{count} extended fantasy trilogy marathons. Second breakfast included.',
  marathon: '{count} actual marathons, assuming you could run one. We are assuming a lot.',
  gym: '{count} gym sessions. The pump would have been unreal.',
  podcast: '{count} hour-long podcasts. Still not enough to explain this report.',
  guitar: '{count} guitar practice sessions. Your covers would be immaculate by now.',
  nap: '{count} power naps. Honestly, comparable outcomes.',
  flight: '{count} London to New York flights. Window seat every time.',
  workweek: '{count} full-time work weeks. That is an internship, a promotion and a crash out.',
}

export const TIME_DISCLAIMER =
  'That is enough modeled time for approximately {count} {label}, assuming {each} each. Whether you would have actually done them is between you and the council.'

export const SHARE_PROMPTS: string[] = [
  'The Goon Audit has spoken. Run yours if you dare.',
  'My spreadsheet is cooked. Is yours?',
  'Officially certified as {verdict}. Respectfully, run yours.',
  'The council reviewed my file. Your turn.',
  'I did the math. The math needs therapy.',
  'Got audited by a tiny lab mascot. Would be judged again.',
  'My lore has been quantified. I regret nothing, mostly.',
  'Results certified by absolutely no one. Get yours.',
  'The Department of Fertilization declined to comment on my results.',
  'Plot twist: the spreadsheet was the final boss.',
]

/** Field helpers, buttons, notices and empty states. */
export const MICROCOPY = {
  currentAgeHelp: 'Your current character-development level.',
  startAgeHelp: 'When did the lore begin? Your best guess is fine.',
  normalHelp: 'Average sessions on a regular day. Be honest. The spreadsheet is not your mother.',
  peakHelp: 'The side-quest difficulty setting. Sessions per day on your busiest days.',
  peakDaysHelp: 'How many days a year hit that peak. Peak days are counted separately from regular days.',
  offDaysHelp: 'Days a year you sit out entirely. Monk mode, flu season, family holidays.',
  offRateHelp: 'Reduced rather than zero? Set the rate for those days.',
  minutesHelp: 'Average minutes per session. No reliable data exists, so this one is yours.',
  presetHelp: 'How much each session counts for. Auto picks based on how often you said you go.',
  erasHelp: 'Different eras, different energy. Split your lore into chapters with their own rates.',
  erasGap: 'Years not covered by any era count as zero.',
  caloriesHelp: 'Optional and illustrative. No study has measured this, so the number is your guess.',
  cta: 'Run my goon audit',
  ctaHelp: 'Everything is calculated on your device. Nothing is uploaded, ever.',
  skip: 'Skip the drama',
  reroll: 'New roast',
  copy: 'Copy results',
  copied: 'Copied',
  share: 'Share',
  download: 'Download PNG',
  downloading: 'Rendering…',
  downloaded: 'Saved',
  restart: 'Run a new audit',
  edit: 'Edit my answers',
  addEra: 'Add an era',
  removeEra: 'Remove era',
  ageGateTitle: 'Adults only past this point.',
  ageGateBody:
    'GOONOMICS is a comedy calculator about self-reported masturbation statistics. It is not explicit, but it is for adults. We do not check ID and we do not store your answer beyond this browser tab.',
  ageGateYes: 'I am 18 or older',
  ageGateNo: 'Take me somewhere wholesome',
  noDiagnosis:
    'These are entertainment estimates from your own guesses. A big number is not a diagnosis. If it ever feels compulsive or starts eating into your life, that is worth talking about with a professional, no judgment.',
  imageFallback: 'The auditor stepped out. The math did not.',
}
