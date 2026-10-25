# Research report

Research done 2026-10-25 before any code or art was produced. Every number the calculator multiplies
by is listed here with its source, its type and how to read it. The same data lives in code in
[`src/lib/assumptions.ts`](../src/lib/assumptions.ts) and [`src/lib/sources.ts`](../src/lib/sources.ts).

## 1. Science

### 1.1 Semen volume and sperm number per ejaculate

The WHO laboratory manual, 6th edition (July 2021), publishes the distribution of semen results
from 3,500+ men whose partners conceived within 12 months (Campbell et al., *Andrology* 2021).
The Manchester University NHS Foundation Trust andrology lab reproduces the full centile table
(document V2, 28 Oct 2022), which is where we read the numbers:

| Parameter | 5th centile (reference limit) | 25th | **50th (median)** | 75th | N |
|---|---|---|---|---|---|
| Semen volume (mL) | 1.4 (1.3–1.5) | 2.3 | **3.0** | 4.2 | 3,586 |
| Concentration (million/mL) | 16 (15–18) | 36 | **66** | 110 | 3,587 |
| Total sperm number (million/ejaculate) | 39 (35–40) | 108 | **210** | 363 | 3,584 |

How we use it:

- **Default per-session values are medians (3.0 mL, 210 million)**, labelled *population median*.
- **The 5th centile is a clinical lower reference limit, not an average.** It is shown only for
  contrast and is never used as a default (a unit test enforces this).
- **We use total sperm per ejaculate, not concentration.** Multiplying sessions by concentration would
  be a unit error.
- **The uncertainty range** uses the 25th–75th centiles.
- These samples were taken after 2–7 days of abstinence. That matters, see 1.2.

Sources:
[WHO manual](https://www.who.int/publications/i/item/9789240030787) ·
[Campbell et al. 2021](https://doi.org/10.1111/andr.12983) ·
[NHS MFT centile table](https://mft.nhs.uk/app/uploads/sites/4/2023/01/Lower-reference-limits-2021.pdf)

### 1.2 Frequent ejaculation lowers per-session output

Mayorga-Torres et al. (*Reproductive Biology and Endocrinology* 13:47, 2015) followed six men through
two weeks of daily ejaculation. Baseline (3–4 days abstinence) was 2.5 mL and 277 million; on daily
days 2–13 volume averaged about 1.8 mL and total count about 115 million (values 88.7–138.2 M).

We expose this as the **"frequent" preset (1.8 mL, 115 M)**, labelled *measured average, small study*,
and the **Auto** setting switches to it when the modeled average is ≥ 1 session/day. The threshold of
1/day is our own selected assumption matched to the study design. n = 6, so this is a hint, not a law.

Source: [PMC4445565](https://pmc.ncbi.nlm.nih.gov/articles/PMC4445565/)

### 1.3 Sperm cells are not children

Fertilization needs one sperm cell, an egg that is present at the right time, and survival through
a long list of barriers; most cells never reach the egg. A count of cells therefore cannot be
converted into a number of potential children. The site makes this the punchline
("Potential kids wasted: biology says no.") and states the real reason directly underneath.

Source: [Go Ask Alice!, Columbia University](https://goaskalice.columbia.edu/answered-questions/why-does-it-take-millions-sperm-fertilize-egg/) (edited 19 Nov 2025)

### 1.4 Health claims we checked and refuse to make

- Cleveland Clinic (updated 25 Oct 2022) lists infertility, decreased sperm count, erectile dysfunction,
  mental illness and others as **myths not supported by research**, and says masturbation has no
  serious side effects. It flags compulsive use (missing work, cancelling plans) as the thing worth
  talking to a professional about.
- The International Society for Sexual Medicine (11 May 2022) says "there is no scientific basis" for
  claims that it causes sexual dysfunction, infertility or other health problems.

So the site never claims harm, never treats a high count as a diagnosis, and carries a short,
non-preachy note that compulsive patterns are worth discussing with a professional.

Sources: [Cleveland Clinic](https://my.clevelandclinic.org/health/articles/24332-masturbation) ·
[ISSM](https://www.issm.info/sexual-health-qa/what-are-the-myths-and-facts-about-masturbation)

### 1.5 Calories: no established value exists

- Frappier et al. (*PLoS ONE* 2013) measured **partnered** sex in 21 young couples: about 4.2 kcal/min
  (≈ 101 kcal per session) in men. Different activity, small sample.
- The 2024 Adult Compendium of Physical Activities has three sexual-activity codes (1.8, 3.0 and
  5.8 METs) and **no entry for solo activity**.
- We found no study measuring solo sessions.

Decision: calories are **off by default**. If a user opts in, they type their own kcal/min guess
(prefilled at 2, labelled *our assumption*), and the result shows that sitting still already burns
≈ 1.2 kcal/min for a 70 kg adult (1 MET ≈ 1 kcal/kg/h). The headline "energy" stats are openly
**fictional**: Brainrot XP, aura lost (6.7 per session, a nod to Dictionary.com's 2025 word of the
year "67") and a log-scale meter.

Sources: [Frappier 2013](https://doi.org/10.1371/journal.pone.0079342) ·
[Compendium 2024](https://pubmed.ncbi.nlm.nih.gov/38242596/) ·
[Compendium sexual activity codes](https://pacompendium.com/sexual-activity/)

### 1.6 Time comparisons

Only one comparison has a research basis: novel reading time uses Brysbaert's 2019 meta-analysis
(adult silent reading ≈ 238 words/min, 190 studies) with an assumed 90,000-word novel, ≈ 6.3 h. Every
other activity duration (coding lesson 30 min, sitcom 22 min, marathon 4 h 30 min, …) is a stated
assumption shown next to the number. Session length itself has no reliable population data, so it is
a user input (default 15 min, labelled as our assumption).

Source: [Brysbaert 2019](https://doi.org/10.1016/j.jml.2019.104047)

### 1.7 Calendar math

Ages are whole years, so leap days are handled with the mean Gregorian year (365.2425 days) instead
of guessing which leap days fall inside someone's lore. Four modeled years = 1,460.97 days (tested).

## 2. Slang and internet culture

What we checked (Oct 2026):

| Signal | Finding |
|---|---|
| Oxford Word of the Year 2025 | "rage bait" |
| Cambridge Word of the Year 2025 | "parasocial" |
| Dictionary.com Word of the Year 2025 | "67" |
| Oxford Word of the Year 2024 | "brain rot" (shortlist included "lore") |
| Merriam-Webster slang entries | "lock in" (deep focus), "aura farming" |
| Dictionary.com "Just Added" | "aura farming", "clanker" |
| Northeastern University | "crash out" = losing emotional control, took off on TikTok early 2024 |
| 2026 slang guides (Gabb, Colorado State social media guide, others) | rizz, skibidi, fanum tax and sincere "sigma" flagged as fading or cringe |

How it shaped the copy:

- **Used as seasoning:** cooked, down bad, lore, side quest, lock in, touch grass, aura, crash out,
  canon event, final boss, the council, unc, character development, absolute cinema, standing on
  business, brainrot, rage bait. Each appears where the joke needs it, not in every line.
- **Avoided:** skibidi, fanum tax, sincere sigma, rizz as a punchline, "no cap", and wall-to-wall "bro".
- **Tone:** deadpan bureaucracy (exhibits, stamps, councils, interns quitting) does most of the work;
  slang lands on top of it.
- **Hard rules:** no jokes about bodies, masculinity, fertility, health or worth; nothing graphic;
  roasts target the spreadsheet and the absurdity of the audit.

The full library is in [`src/lib/copy/`](../src/lib/copy): (phase 1 figures, superseded in section 5) 45 roasts, 16 headlines, 10 verdicts,
29 loading lines, 16 biology punchlines, 15 time lines, 10 share prompts and 32 interface microcopy strings,
tagged by context, band and intensity. A unit test enforces the minimum counts and no duplicates.

Sources: [Oxford 2025, Smithsonian](https://www.smithsonianmag.com/smart-news/rage-bait-which-desribes-online-content-created-to-make-us-mad-is-oxfords-2025-word-of-the-year-180987776/) ·
[2025 words of the year roundup](https://www.russh.com/2025-words-of-the-year-dictionaries/) ·
[Merriam-Webster: lock in](https://merriam-webster.com/slang/lock-in) ·
[Dictionary.com: aura farming](https://www.dictionary.com/browse/aurafarming) ·
[Northeastern: crashing out](https://cos.northeastern.edu/why-are-people-crashing-out-emotional-breakdowns-have-gone-viral) ·
[Gabb 2026 slang guide](https://gabb.com/blog/teen-slang/) ·
[CSU social media slang 2026](https://social.colostate.edu/best-practices/new-year-new-slang-words-social-media-managers-should-know-in-2026/)

## 3. Competitor and pattern notes

This part comes from familiarity with the formats rather than fresh browsing in this session:
year-in-review share cards, personality-quiz results pages, "life in weeks" style calculators,
satirical bureaucracy sites and receipt/ticket-style share generators.

What we kept: one strong number per screen, a results reveal that feels earned, a portrait share
card sized for feeds (4:5, 1080 × 1350), user control over what goes on the card, and a fast, skippable
loading moment. What we avoided: fake pre-filled stats on the landing page, share links that encode
private answers, identical card grids, and loaders that waste time.

## 4. Visual direction

**Concept:** a case dossier from a fake national institute. The form is an intake form with lettered
*Exhibits* (a real sequence). The report is a stamped case file: manila tab, file number, ledger rules,
section marks (§1–§5) that match the contents index on the landing page.

- **Palette:** brief tokens (`#0C0C0F`, `#17171C`, `#202027`, `#F5F5F5`, `#9898A5`, `#C5FF5C`, `#FF6B6B`)
  plus one restrained manila `#CDBF94` used only for folder tabs and gap warnings, echoing the
  case folders in the hero art.
- **Type:** Big Shoulders Display (condensed civic-signage grotesk, originally drawn for Chicago) for
  headlines and the wordmark; Hanken Grotesk for body; IBM Plex Mono for every statistic. All
  self-hosted, no third-party font requests.
- **Motion budget:** one load moment (lime scan-wipe across the hero headline) and one big moment (the
  verdict stamp slams onto the file). Everything else is still. Reduced motion removes both.
- **Imagery:** the generated hero sits behind the hero only; the mascot carries continuity (header,
  hero, age gate, loading scanner, verdict, time section, share card) with SVG props for each mood.

## 5. GOONOMICS 2.0 trend research (2026-10-25)

Fresh searches before rewriting the copy. What changed the product:

| Finding | Source | What we did |
|---|---|---|
| "6-7" was named Gen Z's most hated slang (40%), ahead of skibidi (38%) and sigma (32%) in Preply's survey | [VICE](https://www.vice.com/en/article/gen-z-hates-these-popular-words-for-being-insanely-cringe/), [UNILAD Tech](https://www.uniladtech.com/news/study-reveals-slang-words-most-cringeworthy-gen-z-374787-20260302) | Removed the old "6.7 aura per session" gag. A test now fails if "67" appears in visible copy. No skibidi, sigma, rizz or fanum tax. |
| "Aura" is at full saturation; aura points started as a TikTok joke in May 2024 | [Know Your Meme: aura](https://knowyourmeme.com/editorials/whats-with-all-the-memes-about-having-aura-from-van-dijk-to-tiktok-heres-aura-points-explained), [2026 glossary](https://genppt.com/blog/gen-alpha-slang) | Used once, twisted: "aura debt" as a labelled fictional metric. |
| "It's so over / we're so back" spread almost entirely as plain text, ideal for captions | [Know Your Meme](https://knowyourmeme.com/memes/its-so-over-were-so-back) | Caption and burnt roast lines, not interface labels. |
| "Let him cook" signals someone about to do something impressive | [Know Your Meme guide](https://knowyourmeme.com/editorials/guides/what-does-let-him-cook-mean-the-phrase-explained) | Ironic use in high band roasts and captions. |
| "Chat, is this real" is still in active use in 2026 | [meme.com](https://meme.com/memes/chat-is-this-real) | One results headline, one caption. |
| Share cards spread when they carry a "flex" element: a big number, rank or score; Stories are 1080 × 1920; share prompts work best right after the reveal | [Shareable result card guide](https://www.skills.sh/khadinakbarlabs/expo-mobile-app-builder/design-shareable-result-card), [quiz result guidance](https://quizandsurveymaster.com/?p=606773), [Spotify Wrapped analysis](https://nogood.io/?p=44277) | Added the GOI score as the flex number, put the share call to action next to the reveal, built dedicated 1080 × 1920 and 1080 × 1080 artboards. |
| 2026 slang lists still treat cooked, touch grass, lore, lock in, crash out and let him cook as current | [Gabb 2026 guide](https://gabb.com/blog/teen-slang/), [Simplified 2026 list](https://simplified.com/blog/ai-writing/gen-z-slang-words-and-how-to-use-them) | Core vocabulary of the flow: "Get cooked", "The lore", "locked in days", "side quests". |

Searches for "aura debt", "bro needs patch notes" and "not beating the allegations" returned no
reliable coverage, so they are used sparingly as phrasing rather than presented as named memes.

Tone rules for 2.0: interface labels stay short and literal with one joke at most; the roast, stamp
and captions carry the heat. Three roast libraries (Lightly cooked, Medium rare, Burnt to a crisp)
cover five result bands each, 63 roasts total, and never touch bodies, health, masculinity,
fertility or worth. No hyphens or dashes in visitor facing copy, enforced by a test.

## 6. 2.1 research (2026-10-25, second pass)

| Finding | Source | What changed |
|---|---|---|
| "POV" score reveal videos ("POV: you scored 21.2% on your test") are a live format | [TikTok test scores results trend](https://www.tiktok.com/discover/test-scores-results-trend) | POV captions in the caption generator |
| "Your cooked" self roasting memes are a TikTok discover category | [TikTok: your cooked](https://www.tiktok.com/discover/your-cooked) | "Get cooked" step name, "Who is more cooked?" comparison |
| Aura farming, delulu, crash out, brainrot and the "Gen Z stare" appear in current 2026 glossaries | [Slangwise 2026 watchlist](https://slangwise.com/35-new-slang-words-taking-over-the-internet-right-now-2026-watchlist/), [SheKnows 2026 teen slang](https://www.sheknows.com/parenting/slideshow/1234883077/teen-slang-2026/) | Used sparingly in live comments; the side eye sticker plays the stare |
| "67" stays the most disliked term in the Preply survey | [VICE](https://www.vice.com/en/article/gen-z-hates-these-popular-words-for-being-insanely-cringe/) | Still banned by test |
| No dated Know Your Meme entry for a 2025 to 2026 crying reaction trend; crying reactions remain generic reaction staples | [Know Your Meme: crying duck](https://knowyourmeme.com/memes/crying-duck-meme) | The crying swimmer is an original sticker, not a copy of any template |

The live commentary library holds 83 lines across age, years of lore, daily rate, peak days,
peak rate, locked in days, roast heat and session length. Each range has a small pool and the pick is
stable for a given value, so comments change exactly when the numbers do.

## 7. 3.0 research: badges, Instagram, SEO (2026-10-25)

| Finding | Source | What changed |
|---|---|---|
| Aura quizzes ("how much aura do you have") are a crowded, proven quiz format | [uQuiz](https://uquiz.com/quiz/WyyQAD/how-much-aura-do-you-have) | Rank badges use aura language: Aura Farmer, Aura Legend |
| "Gooning" carries a sexual meaning in US slang; searches rose sharply since 2023 | [Know Your Meme](https://knowyourmeme.com/sensitive/memes/gooning-goon-cave), [Daily Dot](https://dailydot.com/?p=1648264) | Never in ad text, keywords or hashtags; adult theme stated plainly on the site |
| Google Ads restricts sexually suggestive content and bans adult themes in family looking content | [Google Ads policy](https://support.google.com/adspolicy/answer/6015406?hl=en), [Search Engine Roundtable](https://www.seroundtable.com/google-ads-updates-sexual-content-policy-42306.html) | See `docs/SEO.md`: Search only, safe keyword clusters, negative keywords |
| Instagram limits sexually suggestive content in recommendations to non followers | Instagram recommendation guidelines | Instagram kit uses no sexual hashtags or wording |
| Sends per reach and watch time drive non follower reach; Trial Reels test with non followers first | Buffer, Later and Instagram creator announcements | Every caption ends with a send or tag prompt; one Trial Reel script |
| Core Web Vitals thresholds: LCP 2.5 s, INP 200 ms, CLS 0.1 | web.dev Core Web Vitals | Static landing HTML, preloaded fonts, lazy results chunk |
