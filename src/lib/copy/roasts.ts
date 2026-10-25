import type { Band } from './verdicts'

/**
 * Roasts target the absurdity of the audit and the spreadsheet, never the person's body, health,
 * masculinity, fertility or worth. Placeholders: {sessions} {hours} {years}.
 */
export interface Roast {
  bands: Band[] | 'any'
  intensity: 'mild' | 'spicy'
  text: string
}

export const ROASTS: Roast[] = [
  // zero
  { bands: ['zero'], intensity: 'mild', text: 'The archive is so empty the auditor checked if the form was broken. It was not.' },
  { bands: ['zero'], intensity: 'mild', text: 'Clean file. Suspiciously clean. The council is going to need a minute.' },
  { bands: ['zero'], intensity: 'spicy', text: 'Monk mode so strong the spreadsheet is filing a missing-persons report.' },

  // low
  { bands: ['low'], intensity: 'mild', text: 'The archives are so light we filed them under "misc".' },
  { bands: ['low'], intensity: 'mild', text: 'This is the lore of someone who keeps a houseplant alive on purpose.' },
  { bands: ['low'], intensity: 'mild', text: 'Your whole spreadsheet fits on a sticky note. The council is almost disappointed.' },
  { bands: ['low'], intensity: 'mild', text: 'Minimal side quests. Main-story merchant. Respect.' },
  { bands: ['low'], intensity: 'spicy', text: 'You touch grass so consistently the grass has started asking questions.' },
  { bands: ['low'], intensity: 'mild', text: 'The auditor checked twice. Still mostly whitespace.' },
  { bands: ['low'], intensity: 'spicy', text: 'Low numbers, high aura. We do not make the rules. We do make the spreadsheet.' },

  // mid
  { bands: ['mid'], intensity: 'mild', text: 'The archives have become difficult to organize. We bought a label maker.' },
  { bands: ['mid'], intensity: 'mild', text: 'Your character development has generated real, physical paperwork.' },
  { bands: ['mid'], intensity: 'spicy', text: '{sessions} entries. The intern has requested a mental health day.' },
  { bands: ['mid'], intensity: 'mild', text: 'This lore needs a wiki and at least two volunteer moderators.' },
  { bands: ['mid'], intensity: 'spicy', text: 'Respectfully, the filing cabinet is down bad.' },
  { bands: ['mid'], intensity: 'mild', text: 'Your side quest has more hours logged than some people’s main quest.' },
  { bands: ['mid'], intensity: 'mild', text: 'The council reviewed your file and said “huh” out loud. Twice.' },
  { bands: ['mid'], intensity: 'spicy', text: 'Certified lore enjoyer. Unpaid. Unsupervised. Undeterred.' },
  { bands: ['mid'], intensity: 'mild', text: 'The spreadsheet is not judging you. The formula bar is, a little.' },
  { bands: ['mid'], intensity: 'mild', text: 'Somewhere a productivity coach just felt a disturbance.' },
  { bands: ['mid'], intensity: 'spicy', text: 'Mid-tier numbers, top-tier consistency. Standing on business.' },

  // high
  { bands: ['high'], intensity: 'mild', text: 'The spreadsheet has requested annual leave.' },
  { bands: ['high'], intensity: 'mild', text: 'Your file is so thick the auditor needed a second clipboard.' },
  { bands: ['high'], intensity: 'spicy', text: 'Excel is asking whether you meant to type that many digits.' },
  { bands: ['high'], intensity: 'mild', text: 'This is not a ledger anymore. It is a trilogy with a spin-off.' },
  { bands: ['high'], intensity: 'spicy', text: 'The Department of Time Management has gone quiet. Ominously quiet.' },
  { bands: ['high'], intensity: 'spicy', text: 'You did not have a side quest. The side quest had you.' },
  { bands: ['high'], intensity: 'mild', text: 'Your lore has lore.' },
  { bands: ['high'], intensity: 'spicy', text: 'Locked in. Just not on the thing your teachers meant.' },
  { bands: ['high'], intensity: 'mild', text: 'The intern quit. The replacement intern also quit.' },
  { bands: ['high'], intensity: 'spicy', text: '{hours} hours. Absolute cinema, in the least cinematic sense.' },

  // max
  { bands: ['max'], intensity: 'mild', text: 'The council has convened an emergency session and ordered snacks.' },
  { bands: ['max'], intensity: 'mild', text: 'Your character arc generated enough documentation for three departments.' },
  { bands: ['max'], intensity: 'spicy', text: 'Final boss energy. The kind with two health bars and a cutscene.' },
  { bands: ['max'], intensity: 'mild', text: 'We switched to scientific notation out of respect.' },
  { bands: ['max'], intensity: 'spicy', text: 'The auditor has started a podcast about your file. It is doing numbers.' },
  { bands: ['max'], intensity: 'spicy', text: 'This is not a canon event. This is the entire canon.' },
  { bands: ['max'], intensity: 'mild', text: 'The archive has been relocated to a larger building.' },
  { bands: ['max'], intensity: 'spicy', text: 'Unc-level tenure, regardless of your actual age.' },

  // any band with activity
  { bands: ['low', 'mid', 'high', 'max'], intensity: 'mild', text: 'The math is done. The math is not okay.' },
  { bands: ['low', 'mid', 'high', 'max'], intensity: 'mild', text: 'Every number here is an estimate. Every estimate here is unhinged.' },
  { bands: ['low', 'mid', 'high', 'max'], intensity: 'mild', text: 'Nobody is cooked. The spreadsheet is cooked.' },
  { bands: 'any', intensity: 'mild', text: 'Your results are confidential. Your vibes are not.' },
  { bands: 'any', intensity: 'mild', text: 'We have seen worse. We have seen better. Mostly we have seen spreadsheets.' },
  { bands: ['mid', 'high', 'max'], intensity: 'spicy', text: '{years} years of lore and not a single progress report filed. Until now.' },
]

export const HEADLINES: { bands: Band[] | 'any'; text: string }[] = [
  { bands: 'any', text: 'The audit is complete.' },
  { bands: 'any', text: 'Your lore has been processed.' },
  { bands: 'any', text: 'The council has reviewed the evidence.' },
  { bands: ['mid', 'high', 'max'], text: 'Findings: extensive.' },
  { bands: 'any', text: 'Report filed. Do not forward to your mother.' },
  { bands: 'any', text: 'We did the math. The math needs therapy.' },
  { bands: 'any', text: 'Case closed. Tabs still open.' },
  { bands: ['mid', 'high', 'max'], text: 'The numbers are in. They brought friends.' },
  { bands: 'any', text: 'Evidence logged. Witnesses confused.' },
  { bands: 'any', text: 'The spreadsheet has spoken.' },
  { bands: 'any', text: 'Character development, quantified.' },
  { bands: ['high', 'max'], text: 'Your past has requested legal representation.' },
  { bands: 'any', text: 'Audit status: deeply unnecessary, fully complete.' },
  { bands: 'any', text: 'Results certified by absolutely no one.' },
  { bands: ['zero', 'low'], text: 'Clean file. Suspiciously clean.' },
  { bands: ['zero'], text: 'The archive is basically a screensaver.' },
]
