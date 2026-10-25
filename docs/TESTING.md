# Testing report (responsive QA and 2.1 redesign)

Run on 2026-10-25, Windows 11, Node 24.12, Chrome via browser automation against the production
build (`vite preview`). Viewports were tested with exact size iframes on the real build.

## Automated: `npm test` → 104 / 104 passing

| Suite | Tests | Covers |
|---|---|---|
| `calc.test.ts` | 28 | engine math, no double counting, leap years, presets, eras, overlaps, determinism |
| `validate.test.ts` | 19 | parsing, missing values, 18+, contradictions, eras |
| `features.test.ts` | 19 | **17 a day cap** for 0, 1, 16, 17, 0.5, 1,5, 17.01, 18, 25, negatives, blanks, junk, peak rate and eras, no silent clamping; largest input stays finite; alternate timeline counts equal modeled minutes ÷ stated durations and follow edited assumptions; calorie line labelled as a guess; card default selection, stats from the real result, type shrinking with more fields; Versus winner, loser, tie |
| `copy.test.ts` | 12 | minimum counts, roasts for every heat × band, no duplicates, **no hyphens or dashes in any visitor facing string** (including live comments, validation errors, Versus, score manual, card labels, timeline labels), no "67" meme, seeded picks, live comments react to every field and fill every placeholder |
| `goi.test.ts` | 7 | GOI bounds, monotonic, deterministic, bands; achievement thresholds |
| `qr.test.ts` | 3 | QR file at `public/assets/goonomics-qr.png` decodes to `https://goonomics.vercel.app`, also at 210 px |
| `format.test.ts` | 6 | number, volume, duration formatting |
| `App.test.tsx` | 10 | age gate; landing and how it works sheet; live comments while typing; step 1 blocks bad timelines; **over limit message on 25 and submission blocked**; back keeps answers; correct numbers, GOI, achievements, score manual, swimmers, timeline; **no fetch calls**; heat changes the roast but not sessions or GOI; card uses the QR path, shows no domain, default hides stats, Show all exposes them, Recommended hides them again, roast copy excludes ages; Versus verdict and invalid GOI; edit and start over; methodology sheet |

UI tests run with `prefers-reduced-motion: reduce` emulated. `npm run typecheck` and `npm run build`
are clean; the main bundle is 467 KB (152 KB gzipped) and the results chunk loads during the audit.

## Responsive QA

A harness walked the whole journey at every size and measured: page scroll, panels that needed
their internal fallback scroll, horizontal overflow, clipped text, and truncated text.

| Viewport | Result |
|---|---|
| 320 × 700 | ✅ all screens fit (only while the over limit error is showing does step 2 need 11 px of quiet scroll) |
| 360 × 800 | ✅ all screens fit |
| 390 × 844 | ✅ |
| 430 × 932 | ✅ |
| 768 × 1024 | ✅ |
| 1024 × 768 | ✅ |
| 1280 × 800 | ✅ |
| 1440 × 900 | ✅ |
| 1920 × 1080 | ✅ |
| 844 × 390 (landscape phone) | Page never scrolls; step 2, Damage, Timeline, Versus and the card need 16 to 52 px of internal scroll with no visible scrollbar |
| 640 × 400 (1280 × 800 at 200% zoom) | Same: page never scrolls; panels need 10 to 67 px of internal scroll |

No horizontal overflow and no truncated text at any size after the fixes below.

## Bugs found and fixed

1. **Page scrolled on phones:** fixed position action bars plus bottom padding grew the page. Replaced by a viewport locked shell (`h-dvh`) with pinned action bars inside each screen.
2. **Sideways scroll at 320 px:** a speech bubble positioned at `right: 78%` hung off the left edge. Bubbles now sit in the layout flow.
3. **Mascot and stickers ignored their position:** components forced `relative` over a caller's `absolute`, so the landing sticker fell behind the explainer. Fixed at the source.
4. **Truncated numbers:** "17,…" sessions, "2.01 trill…", "31.5…", and on the share card "2.01 trilli…" and "182 days, 8…". Values now size to their length or split number and scale word.
5. **Card preview did not match the export:** the preview lived inside a button, which centred its text. The card now sets its own alignment.
6. **Step 2 did not fit 320 to 390 px:** Nerd settings moved into the action bar, sliders get shorter on short screens, subtitles hide when space is tight.
7. Card chips and buttons truncated at 320 px; the share studio had an empty grid cell; caption cut to one line.
8. Timeline fictional meters truncated their labels on phones.
9. A copy file was overwritten on disk mid session (an editor or sync conflict); restored, and your manual edits ("Scan to get Cooked!" and the new disclaimer) were kept.

## Export checks (real PNGs from the production build)

| Case | Size | QR decodes to production URL | Domain text on card | Overflow |
|---|---|---|---|---|
| Recommended fields | 1080 × 1920 | ✅ | none | none |
| Show all the receipts | 1080 × 1920 | ✅ | none | none, after the stat sizing fix |
| Longest verdict, Burnt to a crisp, all fields | 1080 × 1920 | ✅ | none | none |

Console: no errors or warnings during a full run. No broken images. Every request same origin, no cookies.

## Not tested

- Real devices, Safari and Firefox (desktop Chrome with exact size frames).
- Native share sheet and WhatsApp app launch (link format tested, apps not opened).
- The live deployment, so the QR is verified to encode the URL, not to reach a live page.
