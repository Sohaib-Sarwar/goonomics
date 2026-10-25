/** Generated artwork shipped in public/assets (see docs/ASSETS.md for provenance and cost). */
export const ASSETS = {
  mascot: {
    src: '/assets/goonomics-mascot.webp',
    small: '/assets/goonomics-mascot-sm.webp',
    width: 688,
    height: 688,
    alt: 'The GOONOMICS auditor: a lime green little swimmer in black rectangular glasses, holding a clipboard and looking deeply unimpressed.',
  },
  hero: {
    srcSet: '/assets/goonomics-hero-960.webp 960w, /assets/goonomics-hero-1600.webp 1600w, /assets/goonomics-hero-2048.webp 2048w',
    src: '/assets/goonomics-hero-1600.webp',
    width: 2048,
    height: 1152,
    alt: 'A dark forensic lab at night: a microscope, stacked case folders and evidence boxes under thin lime rim lighting.',
  },
} as const

/** The swimmer squad: reaction stickers cut from the Higgsfield sheet (npm run stickers). */
export const STICKERS = {
  cry: { src: '/assets/sticker-cry.webp', alt: 'A little swimmer crying huge cartoon tears behind its glasses.' },
  inspect: { src: '/assets/sticker-inspect.webp', alt: 'A little swimmer gasping at something through a magnifying glass.' },
  stare: { src: '/assets/sticker-stare.webp', alt: 'A little swimmer giving a flat, unimpressed side eye.' },
  cheer: { src: '/assets/sticker-cheer.webp', alt: 'A little swimmer cheering with both arms up and confetti.' },
  paper: { src: '/assets/sticker-paper.webp', alt: 'A little swimmer squinting suspiciously at a sheet of paper.' },
} as const

export type StickerName = keyof typeof STICKERS
