# GOONOMICS: The Goon Audit

> Your lore. Under investigation.

A comedy calculator disguised as a scientific audit. Three steps, a live roasting auditor, one
dramatic verdict, one meme card worth posting. Adults only, non graphic, honest about the science.
Runs entirely in the browser: no backend, no analytics, no cookies.

![Social preview](public/og.jpg)

## The experience

| Screen | What happens |
|---|---|
| **Landing** | "Your lore. Under investigation." plus a three phone explainer (Drop the lore → Get the audit → Cook your friends) built in real HTML, not images. |
| **1 The lore** | Current age and starting age, big plus and minus inputs. |
| **2 The receipts** | Sliders for daily side quests, peak down bad days, side quests on peak days and locked in days. Roast heat: Lightly cooked, Medium rare, Burnt to a crisp. Nerd settings (session length, eras, science preset, calorie guess) live in a sheet. |
| **Live commentary** | The auditor reacts to every value as you type or slide, with spicy lines that change with the number. |
| **3 Get cooked** | Skippable audit theatre, then five panels: **Damage** (verdict, stamp, GOI, sessions, time, roast, achievements), **Swimmers** (the crying swimmer, reality check), **Timeline** (the alternate timeline), **Versus** (who is more cooked), **The card** (share studio). |

Every screen is laid out to fit the viewport. The page never scrolls; on very short screens
(landscape phones, 200% zoom) a panel scrolls internally with no visible scrollbar.

Daily rates are capped at 17. Anything higher is rejected, never clamped, with:
"HOW ARE YOU EVEN ALIVE? 💀 MAX IS 17. BRO, WE ARE CALCULATING, NOT SUMMONING THE FBI."

## GOI: the Goonomics Index

An entertainment score from 300 to 850:

```
GOI = 300 + 550 × (0.75 × volume + 0.25 × intensity)
volume    = log10(1 + lifetime sessions) / log10(1 + 50,000), capped at 1
intensity = log10(1 + sessions per day) / log10(1 + 4), capped at 1
```

Every GOI unlocks a **rank badge**: 300 Touch Grass Certified, 400 Side Quest Rookie, 480 Aura
Farmer, 560 Lore Lord, 640 Aura Legend, 720 Peak Gooner, 800 Ultimate Gooner. Each has its own
emblem (`public/assets/badge-<id>.webp`) and shows on the Damage tab, the card and Versus.

Achievements are grouped into six **badge categories**: Grind, Time sink, Frequency, Lore,
Discipline and Chaos. Same inputs always give the
same score; roast heat changes the jokes, never the number. It does not measure health, habits,
fertility, intelligence or worth. Tap the GOI on the results screen for the score manual.

## Sharing

**One master card**, 1080 × 1920, built for Stories and phones. "What are we exposing?" toggles
ten fields on the same card: GOI, rank badge, verdict, lifetime sessions, volume, swimmers, time,
brainrot XP, roast, achievement. **Show all the receipts** selects everything; **Recommended** goes back to the
privacy friendly default (GOI, rank badge, verdict, roast, achievement). The card resizes its own type so
nothing clips, and the export is rendered from a separate off screen copy at native size, so the
page layout can never distort it.

| Action | How |
|---|---|
| Download the meme | PNG, 1080 × 1920, made in the browser |
| Share the receipts | Web Share API with the PNG where supported (most phones), text and link otherwise |
| Copy the roast / caption | Clipboard, with a caption generator |
| WhatsApp | `https://wa.me/?text=` link with the caption and site link |
| Compare with a friend | Opens Versus: type their GOI, get a verdict, copy or share it |

The card shows **no domain text**; the QR and "Scan to get Cooked!" do the job. Ages and raw answers
never appear on the card or in shared text.

## QR code

To replace the QR code, overwrite `public/assets/goonomics-qr.png` with your new PNG using the same filename.

The placeholder encodes `https://goonomics.vercel.app` (regenerate with `npm run qr`). A test
decodes the file to check it. Keep it square with a light background and a quiet zone; the card puts
it on a white plate. `/assets/` files are cached for an hour, so a replacement shows up soon after
redeploying.

## Run it

Requires Node 22.12+ or 24.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 107 tests
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ on http://localhost:4173
npm run qr         # regenerate the placeholder QR
npm run assets     # rebuild mascot and hero images from assets-source/higgsfield
npm run stickers   # cut the reaction stickers from the Higgsfield sheet
npm run og         # rebuild the social preview image
npm run badges     # rebuild the rank badge emblems from assets-source/higgsfield
```

## Deploy to Vercel

Zero extra config: import the repo in Vercel, or `vercel --prod`. `vercel.json` sets a strict CSP,
immutable caching for hashed bundles in `/_app/` and short caching for `/assets/`.

## Images and storage

All artwork is in this repo. Nothing loads from Higgsfield or any CDN at runtime.

- `assets-source/higgsfield/`: original downloads as lossless WebP (mascot, lab hero, reaction sheet).
- `public/assets/`: web versions built from those originals, including the five swimmer stickers
  (cry, inspect, stare, cheer, paper) and the seven rank badge emblems.
- Captions, stamps ("COOKED"), speech bubbles and phone mockups are live HTML so they stay sharp and
  spelled right.

Credit usage and provenance: [docs/ASSETS.md](docs/ASSETS.md).

## Project layout

```
src/
  App.tsx                  screen flow: landing → lore → receipts → audit → results
  components/              Landing, StepLore, StepReceipts, LiveCommentary, Stepper, LoadingSequence,
                           Results, Timeline, Versus, CardStudio, MasterCard, ScoreManual, Badge,
                           ReceiptsModal, Mascot (art, stickers, bubbles, stamp), ui (frame, sheet,
                           slider, fit box)
  lib/
    calc.ts                calculation engine (pure)
    assumptions.ts         every constant with unit, type, source and caveat
    goi.ts, badges.ts, achievements.ts, timeline.ts, card.ts
    validate.ts            form state → validated input, 17 a day cap
    share.ts, site.ts      export, clipboard, Web Share, WhatsApp; production URL and QR path
    copy/                  roasts by heat and band, live comments, verdicts, captions, microcopy
docs/                      RESEARCH.md, ASSETS.md, TESTING.md, SEO.md (keywords, Google Ads policy)
```

## Disclaimer

For the memes, not med school. Estimates come from your own guesses, cells are not kids, and none of
this is medical advice.
