# Testing report (GOONOMICS 2.0)

Run on 2026-10-25, Windows 11, Node 24.12, Chrome via browser automation against the production
build (`vite preview`).

## Automated: `npm test` → 81 / 81 passing

| Suite | Tests | Covers |
|---|---|---|
| `src/lib/calc.test.ts` | 28 | engine math: peak and locked in days carved out once, reduced rate, zero, fractional, leap year averaging, presets, ranges, huge inputs, eras, overlaps, determinism, tiers |
| `src/lib/validate.test.ts` | 19 | parsing, missing values, 18+, contradictions, limits, eras |
| `src/lib/format.test.ts` | 6 | number, volume and duration formatting |
| `src/lib/goi.test.ts` | 7 | GOI bounds (300 to 850), monotonic, deterministic, bands; achievements thresholds including monk mode alone at zero |
| `src/lib/copy/copy.test.ts` | 10 | minimum counts, every heat × band has roasts, no duplicate jokes, **no hyphens or dashes in any visitor facing string** (roasts, microcopy, verdicts, achievements, activities, validation errors), no "67" meme, seeded picks, roast seed changes only the roast |
| `src/lib/qr.test.ts` | 3 | QR at `public/assets/goonomics-qr.png`, decodes to `https://goonomics.vercel.app`, still decodes at 210 px |
| `src/App.test.tsx` | 8 | age gate and decline; stepper current step; step 1 blocks invalid input; back and forward keep answers; full run shows 3,652 sessions, correct verdict, GOI in range, correct achievements, 420 billion swimmers; **no fetch calls**; heat changes roast but not sessions or GOI; share cards show the QR from the documented path, the domain and the real value (2,191); Story 1080 × 1920 and Square 1080 × 1080; WhatsApp link encodes the site URL and no ages; caption copy; friend comparison; edit keeps answers; start over clears; receipts dialog opens and closes with Escape |

All UI tests run with `prefers-reduced-motion: reduce` emulated. `npm run typecheck` (TypeScript 7,
strict) and `npm run build` are clean.

## Manual: real browser, production build

| Check | Result |
|---|---|
| Step 1 fits one viewport | ✅ desktop 1440 × 900: 900/900; phone 390 × 844: 845/844 |
| Step 2 fits one viewport | ✅ desktop 900/900 after moving sliders into a 2 × 2 grid; phone scrolls (991/844) with the main action pinned in a bottom bar |
| Loading | ✅ fits both viewports, progress, skip, step 3 marked current |
| Results reveal | ✅ desktop 900/900 with verdict, stamp, GOI, sessions, time, roast, heat, achievements; phone scrolls with a bottom action bar |
| Numbers | ✅ 27/14, 1.2 a day, 40 peak days at 3, 25 locked in: 6,244 sessions = 13 × (300.24 × 1.2 + 40 × 3), 65 days, GOI 705, six achievements matching their rules |
| Tabs | ✅ all four panels render; arrow keys move between tabs |
| Story export | ✅ 1080 × 1920 PNG, QR inside the exported image decodes to `https://goonomics.vercel.app` at full and half size |
| Square export | ✅ 1080 × 1080 PNG, QR decodes at full and half size |
| Exported cards inspected visually | ✅ after fixing a stamp hidden behind the mascot and a dead gap in the Story layout |
| Real values on cards | ✅ 6,244 and 13,111 runs showed their own values, file numbers and GOI |
| Mobile overflow | ✅ fixed a transient sideways scroll during the stamp animation (`overflow-x-clip`) |
| Network and storage | ✅ every request same origin; no cookies; only `goonomics:age-ok` in session storage |
| Console | ✅ no errors or warnings during the full flow |

## Bugs found and fixed in this pass

1. Step 2 and results overflowed a 900 px desktop viewport.
2. Mobile result tabs scrolled sideways and hid two tabs; now a 2 × 2 grid.
3. Stamp crushed the verdict into a narrow column on phones.
4. Card stamps rendered behind the mascot's face.
5. Story card had a large empty gap above the footer.
6. Info button had a doubled accessible name.
7. Four captions duplicated headlines; one validation message had a hyphen. Both caught by tests.

## Not tested

- Real phones (checked in 390 × 844 frames in desktop Chrome), Safari and Firefox.
- The native share sheet and WhatsApp app opening (the link format is tested, the apps were not launched).
- The live deployment: the site has not been deployed from here, so the QR has been verified to encode
  the intended URL, not to reach a live page.
