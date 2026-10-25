# Testing report

Run on 2026-10-25, Windows 11, Node 24.12, Chrome (via browser automation) against the production
build served by `vite preview`.

## Automated: `npm test` → 67 / 67 passing

| Suite | Tests | Covers |
|---|---|---|
| `src/lib/calc.test.ts` | 28 | sessions per year, peak days carved out (not added), off days subtracted exactly once, reduced off-day rate, >365 special days rejected, zero frequency, zero modeled years, fractional averages, leap-year averaging (4 years = 1,460.97 days), median/frequent/custom presets, Auto switching at 1/day, reference limit never used as a default, ranges contain the point estimate, largest allowed inputs stay finite, time and activity conversions, calorie toggle and clamp, fictional meter, era sums, uncovered years, era clipping, overlap rejection, peak/off inside eras, determinism, verdict thresholds |
| `src/lib/validate.test.ts` | 19 | number parsing (comma decimals, junk, `1e9`, `Infinity`), missing values, 18+ rule, start after current age, non-integer ages, out-of-range values, zero allowed, peak rate required and ≥ regular, peak + off > year, off-day rate ≤ regular, custom and calorie fields validated only when enabled, eras: contiguous, overlapping, outside window, backwards, gap warning, at least one era, suggested eras contiguous |
| `src/lib/format.test.ts` | 6 | grouping, "2.31 trillion" wording, scientific notation (no 10.00 mantissa), mL → L switch, durations, counts and percents |
| `src/lib/copy/copy.test.ts` | 7 | minimum counts from the brief, no duplicate lines, every band has roasts and headlines, a time line for every activity, seeded selection deterministic and varied, placeholders always filled, loading script shape |
| `src/App.test.tsx` | 7 | age gate and session flag, decline path hides the calculator, inline errors block submission, full flow (form → loading → skip → report) with exact numbers, **no `fetch` calls during the flow**, roast reroll keeps numbers fixed, **copied text contains no ages**, edit keeps answers and new audit clears them, era mode with overlap error then correct total |

Reduced motion: the jsdom setup reports `prefers-reduced-motion: reduce`, so every UI flow test runs
the reduced-motion path of the loading sequence and verdict animation.

`npm run typecheck` (TypeScript 7, strict, `noUncheckedIndexedAccess`) and `npm run build` are clean.

## Manual: browser checks on the production build

| Check | Result |
|---|---|
| Initial render, age gate, confirm | ✅ |
| Hero image, headline scan reveal, report-contents panel with mascot | ✅ |
| Empty submit → error summary focused, field marked | ✅ |
| Simple audit (21 / 13, 0.7 regular, 2 peak × 30 days, 20 off days) | ✅ 2,245 sessions, matches hand calculation; 472 billion cells; 6.7 L; Auto picked WHO median at 0.77/day; 561 h |
| Era audit on a 390 px viewport (14–30, four eras at 1 / 2 / 1.5 / 0.5) | ✅ 7,305 sessions = 4 × 365.2425 × 5; per-era table correct; Auto picked frequent values at 1.25/day (840 billion) |
| Zero frequency | ✅ "The Blank Ledger", 0 everywhere, zero-band roast |
| Loading sequence: progress, messages, Skip | ✅ |
| Roast reroll | ✅ new line, numbers unchanged |
| Download PNG | ✅ real export path, 1080 × 1350 PNG, 242 KB, about 0.8 s; inspected visually: fonts embedded, mascot, stamp and stats present (download intercepted in-page so no file was written) |
| Copy results | ✅ text verified, no ages |
| Native share | Button renders only where `navigator.share` exists; the OS share sheet was **not** opened during testing |
| Mobile 390 px | ✅ after fixing a grid overflow (page was 673 px wide); no horizontal scroll on form or report |
| Missing image fallback | ✅ broken mascot URL swaps in the SVG auditor |
| Network | ✅ every request is same-origin; no cookies; only `sessionStorage` key is the 18+ flag |
| Console | ✅ no errors or warnings on load or during the flow |

## Bugs found and fixed during testing

1. Mascot positioned with `absolute` was overridden by the component's own `relative`, covering text.
2. Wordmark accent bar read as a strikethrough; replaced with lime "OO".
3. Mobile horizontal overflow from grid columns sizing to the methodology table.
4. Loading screen and report showed different file numbers.
5. Long durations and "472 billion" wrapped awkwardly on the dashboard and share card.
6. Stamp covered the small headline on narrow screens.
7. Clumsy auto-generated citation labels ("Go 2025") replaced with explicit short labels.

## Not tested

- Real devices (iOS Safari, Android Chrome); mobile was checked in a 390 px frame in desktop Chrome.
- The OS-level reduced-motion setting in a real browser (covered in jsdom and by the CSS media query).
- Native share sheet, and PNG export in Safari/Firefox.
- The Vercel deployment itself: not deployed from here.
