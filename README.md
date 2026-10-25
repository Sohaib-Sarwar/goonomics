# GOONOMICS: The Goon Audit

> Your lore. Your losses. The spreadsheet is cooked.

An unnecessarily sophisticated, darkly funny research institute that turns people's self-reported
lifetime masturbation estimates into a stamped, sourced, shareable case file. Adults only, non-graphic,
scientifically honest about what the numbers can and cannot mean.

![Social preview](public/og.jpg)

## What it does

1. **Age gate**: simple 18+ self-declaration (not ID verification), remembered for the tab only.
2. **Intake form**: ages, regular and peak frequency, peak and off days, optional *eras* with their own
   rates, session length, per-session output assumption and an opt-in illustrative calorie guess.
3. **Loading sequence**: about 4 s of lab theatre, skippable, shorter with reduced motion. The math is
   already done before it starts.
4. **Report**: verdict with a stamp, auditor's roast (rerollable), lifetime session ledger, the
   little swimmer ledger ("Potential kids wasted: biology says no."), fluid volume with a range,
   side-quest opportunity cost, fictional brainrot meter, optional calories.
5. **Report card**: 1080 × 1350 PNG made in the browser, copyable text and native share. The user picks
   which stats appear; ages and raw answers never do.
6. **Methodology and privacy**: every number, its type and its source, plus exactly what the site does
   with data (nothing).

## Stack

Vite 8 · React 19 · TypeScript 7 · Tailwind CSS 4 · Motion · Lucide · modern-screenshot · Vitest 5 +
Testing Library. Fonts are self-hosted via Fontsource. No backend, no database, no analytics.

## Run it

Requires Node 22.12+ or 24 (the test tooling prefers Node 24.15+; 24.12 works with an engine warning).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 67 tests
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ on http://localhost:4173
```

## Deploy to Vercel

The repo is ready for Vercel with zero extra config:

- Framework preset **Vite** is detected (also pinned in `vercel.json`), build `npm run build`, output `dist`.
- `vercel.json` adds security headers (strict CSP, no framing, no referrer) and long-lived caching for
  `/assets/*`.
- `og:image` URLs become absolute automatically from Vercel's `VERCEL_PROJECT_PRODUCTION_URL`. To use a
  custom domain, set `SITE_URL=https://your-domain` in the project's environment variables.

Either import the Git repository in the Vercel dashboard, or with the CLI:

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production
```

## Project layout

```
src/
  App.tsx                     stage machine: form → loading → results
  components/                 AgeGate, LandingHero, GoonCalculatorForm, AdvancedSettings, LoadingSequence,
                              ResultsDashboard, VerdictCard, StatisticCard, RoastGenerator,
                              ShareableReport, Methodology, PrivacyNotice, Mascot, Wordmark, …
  lib/
    calc.ts                   calculation engine (pure, no UI imports)
    assumptions.ts            every constant with unit, type, sources and caveat
    sources.ts                citations
    validate.ts               form state → validated input (the only way into the engine)
    format.ts                 number, volume, duration formatting
    share.ts                  PNG export, clipboard, native share
    copy/                     verdicts, roasts, headlines, loading, biology, time and share lines, seeded picker
public/assets/                generated artwork (WebP), see docs/ASSETS.md
scripts/                      asset processing and OG image builder
docs/                         RESEARCH.md, ASSETS.md, TESTING.md
```

## How the math works

```
years           = current age − starting age            (each year = 365.2425 days)
sessions / year = peak days × peak rate
                + off days × off-day rate
                + remaining days × regular rate          (peak and off days carved out first)
eras            = each era computed separately; overlaps rejected; gaps count as zero
volume, cells   = sessions × per-session assumption      (WHO 2021 median, or frequent-session values)
time            = sessions × minutes per session
```

Same inputs always give the same numbers. Only the jokes rotate, from a seed derived from the inputs,
and the "New roast" button changes the seed for copy alone.

## Docs

- [Research report with citations](docs/RESEARCH.md)
- [Asset manifest and Higgsfield credit ledger](docs/ASSETS.md)
- [Testing report](docs/TESTING.md)

## Disclaimer

Entertainment only. Estimates come from users' own guesses, cells are not kids, and nothing here is
medical advice. If masturbation ever feels compulsive or starts eating into someone's life, a
professional is the right person to talk to.
