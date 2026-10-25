# GOONOMICS: The Goon Audit

> Your lore. Your losses. No refunds.

A comedy calculator disguised as a scientific audit. Three steps, one dramatic verdict, a shareable
meme card. Adults only, non graphic, honest about what the numbers mean. Runs entirely in the
browser: no backend, no analytics, no cookies.

![Social preview](public/og.jpg)

## The flow

| Step | Screen | What happens |
|---|---|---|
| 1 | **The lore** | Current age and starting age, big plus and minus inputs, live mascot reaction. |
| 2 | **The receipts** | Sliders for daily side quests, peak down bad days, locked in days. Roast heat: Lightly cooked, Medium rare, Burnt to a crisp. Nerd settings hold session length, eras, science preset, calorie guess. |
| 3 | **Get cooked** | Skippable 3 second audit, then the reveal: verdict, stamp, GOI, sessions, time, roast, achievements. Tabs: The damage, The swimmers, The side quest, The allegations (share studio and friend comparison). |

A connected stepper shows progress the whole time. Completed steps are clickable, back keeps every
answer, and editing receipts then re-running recalculates.

## Sharing

| Format | Size | Notes |
|---|---|---|
| Story mode | 1080 × 1920 PNG | Verdict, one big stat, GOI, top achievement, roast, mascot reaction, QR, domain |
| Square mode | 1080 × 1080 PNG | Separate two column composition, not a crop |
| Share the lore | Web Share API | Shares the PNG plus text where the browser supports file sharing (most phones), otherwise text and link |
| Send on WhatsApp | `https://wa.me/?text=` | Opens WhatsApp with the caption, verdict, GOI and link |
| Copy the roast / Copy caption | Clipboard | Caption generator with a "New caption" button |

The user picks the big stat (sessions, swimmers or time). Ages and raw answers are never on the card
or in shared text. Instagram does not let websites post on a user's behalf, so the flow is: download
or share the image, then add it to a Story.

## QR code

The share cards load the QR from:

```
public/assets/goonomics-qr.png
```

It currently encodes `https://goonomics.vercel.app` (generated locally by `npm run qr`, verified by a
test that decodes the file). **To use your own QR art, copy your PNG over that file with the same
name. No code change is needed.** Keep it square with a light background and a quiet zone; the cards
place it on a white plate. Static assets in `/assets/` are cached for an hour (with a day of
stale while revalidate), so a replaced QR shows up quickly after redeploying.

## Run it

Requires Node 22.12+ or 24.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 81 tests
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ on http://localhost:4173
npm run qr         # regenerate the placeholder QR
npm run assets     # rebuild web images from assets-source/higgsfield
npm run og         # rebuild the social preview image
```

## Deploy to Vercel

Zero extra config. Import the repo in Vercel, or `vercel --prod` with the CLI. `vercel.json` sets a
strict CSP, no framing, no referrer, immutable caching for hashed bundles in `/_app/`, and short
caching for `/assets/`. `og:image` points at `https://goonomics.vercel.app/og.jpg`; set `SITE_URL` at
build time if you use another domain, and update `src/lib/site.ts` plus `npm run qr` to match.

## Images and storage

All generated artwork lives in this repo. Nothing loads from Higgsfield or any CDN at runtime.

- `assets-source/higgsfield/` holds the original Higgsfield downloads as lossless WebP (pixel identical).
- `public/assets/` holds the optimized web versions built from those originals.
- Mascot reactions (sweating, shocked, party, void, professor, stamping) are the real mascot plus
  hand drawn SVG props and CSS motion, so they stay on model. Captions and stamps are live text.

See [docs/ASSETS.md](docs/ASSETS.md) for provenance and the credit ledger.

## Project layout

```
src/
  App.tsx                 step machine: lore → receipts → loading → results
  components/
    Stepper.tsx           connected progress indicator
    StepLore.tsx          step 1
    StepReceipts.tsx      step 2 (+ AdvancedSettings.tsx for eras)
    LoadingSequence.tsx   skippable audit theatre
    Results.tsx           reveal, tabs, panels, friend comparison
    ShareStudio.tsx       preview, export, share, captions
    ShareCards.tsx        Story and Square artboards
    ReceiptsModal.tsx     "How we cooked the numbers"
    Mascot.tsx            mascot, reactions, stamp
    ui.tsx                slider, segmented control, big number input, buttons
  lib/
    calc.ts               calculation engine (pure)
    assumptions.ts        every constant with unit, type, source, caveat
    goi.ts                Goonomics Index (300 to 850, entertainment only)
    achievements.ts       fictional achievements with documented thresholds
    validate.ts           form state → validated input
    share.ts              PNG export, clipboard, Web Share, WhatsApp link
    site.ts               production URL and QR path
    copy/                 roasts by heat and band, verdicts, loading, captions, microcopy
assets-source/higgsfield  original generated art
scripts/                  qr, assets, og builders
docs/                     RESEARCH.md, ASSETS.md, TESTING.md
```

## How the math works

```
years           = current age − starting age            (365.2425 days each)
sessions / year = peak days × peak rate + locked in days × their rate + remaining days × daily rate
volume, cells   = sessions × per session preset          (WHO 2021 median, or frequent session values)
time            = sessions × session length
GOI             = 300 + 550 × (0.75 × volume score + 0.25 × intensity score)
```

Same inputs, same numbers. Roast heat and "New roast" change words only.

## Disclaimer

Entertainment only. Estimates come from users' own guesses, cells are not kids, nothing here is
medical advice. If it ever feels out of control, a professional is the right person to talk to.
