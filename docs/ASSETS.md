# Asset manifest and Higgsfield credit ledger

## Budget rule (from the brief)

Lower of **10% of available credits** or **60 credits**, max **3 paid calls**.

| Item | Value |
|---|---|
| Account balance before any generation | **10.00 credits** (free plan, verified with `higgsfield account status`, 2026-10-25) |
| 10% of balance | 1.00 credit |
| Hard ceiling | **1.00 credit**, at most 3 paid calls |
| Balance after all work | **9.70 credits** |
| **Actually spent** | **0.30 credits, 2 paid calls** |

## Pre-spend plan vs. what happened

Prices were checked with `higgsfield generate cost` before anything was submitted.

| # | Planned | Quoted | What happened | Charged |
|---|---|---|---|---|
| 1 | Mascot, GPT Image 2.5 (medium, 1k, transparent) | 0.50 | Rejected before running: `job_minimum_basic_plan_required` (free plan) | 0 |
| 2 | Hero, Soul Location 16:9 | 0.12 | Rejected before running: `job_minimum_basic_plan_required` | 0 |
| 1b | Mascot, **Z Image** 1:1 (one probe to see if any model is open to free plans) | 0.15 | ✅ Succeeded, used | **0.15** |
| 2b | Hero, **Z Image** 16:9 | 0.15 | ✅ Succeeded, used | **0.15** |
| 3 | Reaction sheet, Z Image 4:3 | 0.15 | Rejected: free-plan limit of 1 concurrent job (submitted alongside 2b) | 0 |
| 3b | Reaction sheet, Z Image 4:3 (first actual run) | 0.15 | Job **failed** on Higgsfield's side; balance confirms no charge | 0 |

Per the brief ("skip this asset rather than wasting credits on repeated attempts") the reaction sheet
was not attempted again. Mascot moods are built from the real mascot plus SVG props instead.

Rules followed: no video, no variations, no upscales, no cosmetic regenerations, no text requested
inside images (the wordmark is live type), and user inputs never touch any image prompt (all art was
generated once, at build time).

## Shipped assets

| File | Purpose | Source | Cost |
|---|---|---|---|
| `public/assets/goonomics-mascot.webp` (688², 30 KB) | Mascot for hero, verdict, loading, share card | Z Image, background keyed out locally by `scripts/process-assets.mjs` | 0.15 |
| `public/assets/goonomics-mascot-sm.webp` (240², 10 KB) | Header and age-gate mascot | Same generation, resized | — |
| `public/apple-touch-icon.png` (180²) | iOS home-screen icon | Same generation, flattened on ink | — |
| `public/assets/goonomics-hero-{960,1600,2048}.webp` (17–45 KB) | Responsive hero background | Z Image | 0.15 |
| `public/og.jpg` (1200 × 630, 77 KB) | Social preview | Composited locally by `scripts/make-og.cjs` from the hero + mascot; text set in Big Shoulders / Plex Mono converted to vector paths | 0 |
| `public/favicon.svg` | Favicon | Hand-written SVG | 0 |
| Wordmark | Logo | Live HTML type (`src/components/Wordmark.tsx`) | 0 |
| Mascot fallback | Shown if the image fails to load | Hand-written SVG in `Mascot.tsx` | 0 |
| Mood props (cap, textbook, paper pile, stamp, alarm marks) | Verdict reactions | Hand-written SVG in `Mascot.tsx` | 0 |

## Prompts used

**Mascot (Z Image, 1:1):** original cartoon mascot for a satirical science institute: tadpole-shaped
little swimmer with a round head, wavy tail and stubby arms; deadpan, sleep-deprived eyes; rectangular
black auditor's glasses, lab ID badge, blank clipboard; flat vector style, charcoal outlines, acid-lime
body, off-white highlights, tiny coral accent; plain charcoal background; no text; wholesome, non-sexual.

**Hero (Z Image, 16:9):** cinematic wide shot of a dark forensic lab at night; steel desk with a vintage
microscope, manila case folders, evidence boxes and a desk lamp on the right third; dim monitors with
abstract graphs; thin acid-lime rim light, scan lines, haze; left half calm and empty; no people, no
readable text, no logos.

## Regenerating derived files

Raw downloads live in `assets-raw/` (git-ignored, 5 MB PNGs). With them present:

```bash
npm run assets   # mascot keying, hero sizes, apple-touch icon
npm run og       # social preview (uses the committed hero, works without assets-raw/)
```
