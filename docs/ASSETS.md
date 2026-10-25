# Asset manifest and Higgsfield credit ledger

## Budget rule (cumulative across the whole project)

Lower of **10% of available credits** or **60 credits**, max **3 paid calls**, counted across every
phase. The ceiling was set from the first verified balance and is not reset by later prompts.

| Item | Value |
|---|---|
| Balance before any generation (phase 1) | **10.00 credits**, free plan |
| Ceiling | **1.00 credit**, at most 3 paid calls |
| Balance after all work (phase 2) | **9.70 credits** |
| **Total spent** | **0.30 credits across 2 successful paid calls** |

## Every generation attempt

| Phase | Asset | Model | Outcome | Charged |
|---|---|---|---|---|
| 1 | Mascot | GPT Image 2.5 | Rejected before running: `job_minimum_basic_plan_required` | 0 |
| 1 | Hero | Soul Location | Rejected before running: `job_minimum_basic_plan_required` | 0 |
| 1 | Mascot | Z Image 1:1 | ✅ Used | **0.15** |
| 1 | Hero | Z Image 16:9 | ✅ Used | **0.15** |
| 1 | Reaction sheet | Z Image 4:3 | Rejected: free plan allows one job at a time | 0 |
| 1 | Reaction sheet | Z Image 4:3 | Failed on Higgsfield's side | 0 |
| 2 | Reaction sheet | Z Image 4:3 (cost re-checked: 0.15) | Failed on Higgsfield's side. Briefly reserved, then refunded (9.70 → 9.55 → 9.70) | 0 |

After the second failure of the same sheet, generation stopped, per the brief. The reactions were
built from the existing mascot instead (see below). No videos, upscales, variations, QR codes, icons
or typography were generated.

## Storage: no runtime dependency on Higgsfield

The Higgsfield CDN URLs are not used anywhere in the app. The original downloads are archived in the
repo and every web asset is built from them locally.

| File | What it is |
|---|---|
| `assets-source/higgsfield/mascot-original.webp` | Original mascot, 2048², lossless WebP, pixel identical to the download |
| `assets-source/higgsfield/hero-original.webp` | Original lab hero, 2048 × 1152, lossless WebP, pixel identical |

## Shipped assets

| File | Purpose | Made by | Cost |
|---|---|---|---|
| `public/assets/goonomics-mascot.webp` | Mascot everywhere, reactions, share cards | Higgsfield Z Image, keyed locally (`npm run assets`) | 0.15 |
| `public/assets/goonomics-mascot-sm.webp` | Header and age gate | same generation | — |
| `public/apple-touch-icon.png` | iOS icon | same generation | — |
| `public/assets/goonomics-hero-{960,1600,2048}.webp` | Step 1 background | Higgsfield Z Image | 0.15 |
| `public/assets/goonomics-qr.png` | QR placeholder for `https://goonomics.vercel.app` | `npm run qr` (qrcode library) | 0 |
| `public/og.jpg` | Social preview | `npm run og`, brand fonts as vector paths | 0 |
| `public/favicon.svg` | Favicon | hand written SVG | 0 |
| Reactions: sweat, shock, party, void, professor, stamp | Meme moments in steps, loading, results, cards | Real mascot plus SVG props and CSS motion (`Mascot.tsx`) | 0 |
| Stamp ("COOKED", "WELL DONE", …) and speech bubbles | Meme captions | Live HTML text | 0 |
