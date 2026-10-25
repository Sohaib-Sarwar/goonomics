import type { Band } from './verdicts'

/**
 * Roast heat changes the words, never the numbers. Roasts target the spreadsheet, the lore and the
 * absurdity of the audit; never bodies, health, masculinity, fertility or worth.
 * Placeholders: {sessions} {hours} {years}.
 */
export type Heat = 'light' | 'medium' | 'burnt'

export const HEAT_LABELS: Record<Heat, string> = {
  light: 'Lightly cooked',
  medium: 'Medium rare',
  burnt: 'Burnt to a crisp',
}

export const ROASTS: Record<Heat, Record<Band, string[]>> = {
  light: {
    zero: [
      'Clean record. Honestly, respect.',
      'The spreadsheet had nothing to do today. It is thriving.',
      'Monk mode unlocked. The council is taking notes.',
    ],
    low: [
      'Minor lore. You touch grass and it shows.',
      'Houseplant owner energy. Wholesome.',
      'Barely a side quest. Main character stayed on the main story.',
      'The auditor checked twice. Still mostly vibes.',
    ],
    mid: [
      'Respectable lore. The archive needed one more shelf.',
      'The spreadsheet is fine. Slightly sweaty, but fine.',
      'Solid numbers. Nobody is cooked. Yet.',
      'The council reviewed your file and nodded politely.',
    ],
    high: [
      'Big lore energy. The archive is working overtime.',
      'The spreadsheet asked for a short break. Granted.',
      'That is a lot of paperwork for one person. Impressive, honestly.',
      'Let him cook. He clearly did.',
    ],
    max: [
      'The archive moved to a bigger building. Congrats?',
      'Your lore has its own lore now.',
      'A legendary file. Framed and everything.',
      'The council is in awe. Mostly in awe.',
    ],
  },
  medium: {
    zero: [
      'Zero. Monk mode or you lied to a calculator. Both are valid.',
      'The spreadsheet ran the numbers and found tumbleweeds.',
      'Clean file. The council suspects a cover up.',
    ],
    low: [
      'Your lore fits on a sticky note. The council expected more.',
      'Low numbers, high self control. Annoying, but respectable.',
      'You tried the side quest once and went straight back to the tutorial.',
      'The auditor yawned. Twice.',
    ],
    mid: [
      'The calculator has no right knowing this much.',
      'Your time management allegations have entered evidence.',
      '{sessions} entries. The intern asked for a raise.',
      'This lore needs a wiki and two moderators.',
      'The council reviewed your case and would like to unsubscribe.',
    ],
    high: [
      'Bro generated enough lore for a Netflix documentary.',
      'The spreadsheet is fighting for its life.',
      'Excel asked if you were sure. You were very sure.',
      '{hours} hours. Absolute cinema. Unfortunately.',
      'You did not have a side quest. The side quest had you.',
    ],
    max: [
      'Final boss energy. The kind with two health bars.',
      'We switched to scientific notation out of respect.',
      'Not a canon event. The entire canon.',
      'The council called an emergency meeting and nobody brought snacks.',
      '{years} years of lore and not a single patch note.',
    ],
  },
  burnt: {
    zero: [
      'Zero entries. Monk or liar. The council is checking.',
      'You bored a spreadsheet. That is a first.',
      'No lore. No losses. No notes. Suspicious behavior.',
    ],
    low: [
      'NPC behavior, in the most respectful way.',
      'Your lore is a loading screen.',
      'The council skimmed your file in four seconds. That was generous.',
      'Side quest attempted. Side quest abandoned. Skill issue.',
    ],
    mid: [
      'This is not beating the allegations.',
      'Bro needs patch notes.',
      'Your search history entered the chat and immediately left.',
      'The allegations are not looking good, and they are in a spreadsheet.',
      'Crash out averted. The spreadsheet is less sure.',
    ],
    high: [
      'It is so over. The spreadsheet filed for emotional damages.',
      'Locked in. Just on the wrong thing.',
      'Your alternate timeline has a gym membership and a podcast. You have this.',
      '{hours} hours. That is a whole degree in something else.',
      'Aura debt so deep it is collecting interest.',
    ],
    max: [
      'The council reviewed your case and blocked you.',
      'Lore beyond containment. Burn the archive.',
      'Your file was printed and the printer quit.',
      'The Department of Goonomics is naming a building after you. It is a warning.',
      'Generational fumble, documented to the decimal.',
    ],
  },
}

/** Top line of the reveal, by band. */
export const HEADLINES: Record<Band, string[]> = {
  zero: ['The archive is empty. Suspiciously empty.', 'Clean record. The council is confused.'],
  low: ['The council has decided. Mostly fine.', 'Minor lore detected.', 'We checked. You are barely cooked.'],
  mid: ['The lore runs deep.', 'The council has decided.', 'Chat, is this real?', 'The calculator knows too much.'],
  high: ['The allegations are not looking good.', 'It is so over.', 'The council wants a word.'],
  max: ['The allegations have been upgraded to a case.', 'Absolute cinema. Unfortunately.', 'Lore beyond containment.'],
}
