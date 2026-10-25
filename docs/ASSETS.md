# Asset manifest and Higgsfield credit ledger

## Budget rule (cumulative across the whole project)

Lower of **10% of available credits** or **60 credits**, max **3 paid calls**, counted across every
phase and never reset by a later prompt.

| Item | Value |
|---|---|
| Balance before any generation | **10.00 credits**, free plan |
| Ceiling | **1.00 credit**, at most 3 paid calls |
| Balance now | **9.55 credits** |
| **Total spent** | **0.45 credits across 3 paid calls. The paid call limit is now used up.** |

## Every generation attempt

| Phase | Asset | Model | Outcome | Charged |
|---|---|---|---|---|
| 1 | Mascot | GPT Image 2.5 | Rejected before running (free plan) | 0 |
| 1 | Hero | Soul Location | Rejected before running (free plan) | 0 |
| 1 | Mascot | Z Image 1:1 | ✅ Used | **0.15** |
| 1 | Hero | Z Image 16:9 | ✅ Used | **0.15** |
| 1 | Reaction sheet | Z Image 4:3 | Rejected: one job at a time on free plan | 0 |
| 1 | Reaction sheet | Z Image 4:3 | Failed on Higgsfield's side | 0 |
| 2 | Reaction sheet | Z Image 4:3 | Failed on Higgsfield's side, refunded | 0 |
| 3 | Reaction sheet, simpler prompt with the crying swimmer | Z Image 4:3 (cost checked: 0.15) | ✅ Used: five stickers | **0.15** |

No videos, upscales, variations, QR codes, icons or typography were generated. User inputs never
touch an image prompt; all art was generated once, at build time.

## Storage: no runtime dependency on Higgsfield

| Source file | What it is |
|---|---|
| `assets-source/higgsfield/mascot-original.webp` | Original auditor mascot, 2048², lossless, pixel identical |
| `assets-source/higgsfield/hero-original.webp` | Original lab hero, 2048 × 1152, lossless, pixel identical |
| `assets-source/higgsfield/reactions-original.webp` | Original reaction sheet, 2048 × 1536, lossless, pixel identical |

## Shipped assets

| File | Purpose | Made by | Cost |
|---|---|---|---|
| `public/assets/goonomics-mascot.webp`, `-sm.webp`, `public/apple-touch-icon.png` | The auditor | Z Image, keyed locally (`npm run assets`) | 0.15 |
| `public/assets/goonomics-hero-{960,1600,2048}.webp` | Landing and step 1 background | Z Image | 0.15 |
| `public/assets/sticker-{cry,inspect,stare,cheer,paper}.webp` | Swimmer squad reactions: crying swimmer signature, scientist with magnifier, side eye stare, celebration, suspicious paper | Z Image sheet, cut and keyed locally (`npm run stickers`) | 0.15 |
| `public/assets/goonomics-qr.png` | QR placeholder for `https://goonomics.vercel.app` | `npm run qr` | 0 |
| `public/og.jpg` | Social preview | `npm run og` | 0 |
| `public/favicon.svg` | Favicon | hand written SVG | 0 |
| Phone mockups, stamps, speech bubbles, wordmark | UI and meme captions | live HTML, CSS and SVG | 0 |

The sheet came back with five usable stickers (the sixth cell was empty). The sticker character is a
rounder, die cut cousin of the original auditor with the same lime body and black glasses; it is used
as the "swimmer squad" across live commentary, loading, verdict reactions, Versus and the share card.
