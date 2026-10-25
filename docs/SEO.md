# SEO, Google Ads and performance

Research date: 2026-10-25. Search volumes were not available from here: verify every keyword in
Google Keyword Planner (Tools → Keyword Planner → Discover new keywords, location United States)
before setting bids.

## 1. Read this first: the policy reality

- **Google Ads restricts sexual content.** Explicit content is banned; sexually suggestive content is
  "restricted" and only serves in limited situations based on the query, the user's age and local law
  ([Google Ads inappropriate content policy](https://support.google.com/adspolicy/answer/6015406?hl=en),
  [Search Engine Roundtable on the October 2026 update](https://www.seroundtable.com/google-ads-updates-sexual-content-policy-42306.html)).
  Third party summaries report these ads can run on Search but not YouTube, Display or AdMob
  ([Relevant Audience](https://www.relevantaudience.com/google-ads-en/google-ads-sexual-content-policy-examples-october-2026/)); confirm in your account.
- **Google also prohibits adult themes dressed up as family content.** GOONOMICS has a cute mascot, so
  the 18+ gate, the "Adults only" wording, the meta description and the privacy page all state the
  adult theme plainly. Keep it that way.
- **"Gooner" and "goon" carry a sexual meaning in US slang** (searches for gooning rose 314% from 2023,
  per [Daily Dot](https://dailydot.com/?p=1648264); [Know Your Meme](https://knowyourmeme.com/sensitive/memes/gooning-goon-cave)).
  In the UK, "Gooner" mostly means an Arsenal fan. Expect the brand name itself to trigger a policy
  review. **Do not use goon or gooner in ad text or keywords.**
- Realistic outcome: ads approved as "Eligible (limited)" with Search only delivery, or disapproved.
  Have a backup plan (Reddit, TikTok and Instagram organic, creator seeding).

## 2. Keyword map (United States)

| Cluster | Example keywords | Use for | Notes |
|---|---|---|---|
| Brand | goonomics, goon audit, GOI score | Ads (exact match) and SEO | Cheapest clicks once people know the name |
| "How cooked" quiz | how cooked are you, how cooked am I quiz, am I cooked test | Ads and SEO | Built around the "your cooked" meme; low sexual connotation |
| Aura | aura test, aura points calculator, how much aura do I have, aura legend | Ads and SEO | Aura quizzes are a crowded, proven format ([uQuiz examples](https://uquiz.com/quiz/WyyQAD/how-much-aura-do-you-have)); position GOI as the "aura score for your lore" |
| Group chat | quiz to send to friends, group chat games, funny quiz for friends | Ads and SEO | Matches the Versus feature |
| Gen Z humor | brainrot quiz, gen z quiz, roast me quiz, funny calculator | SEO, test in ads | Broad, high competition |
| Adult slang | gooner test, how much of a gooner am I, goon calculator | **SEO only, never ads** | Sexual meaning in the US; SafeSearch may filter results |

**Negative keywords:** arsenal, gooners fc, football, soccer, premier league, kids, teen, teens,
school, for kids, porn, nsfw, video, videos, cam, free download.

## 3. Google Ads starter setup

- Campaign: Search only, United States, English, all devices (mobile first).
- Demographics: exclude "Unknown" age where possible; bid up 18 to 24 and 25 to 34.
- Landing page: `https://goonomics.vercel.app/` (fast, static, privacy page linked).
- Conversions: there is no analytics on the site by design. Use a click based goal, or add a privacy
  respecting, cookieless counter later and update the privacy page if you do.

**Responsive search ad headlines (30 characters max):**
How Cooked Are You? · Get Your GOI Score · Unlock Your Rank Badge · Roast Your Group Chat ·
One Minute. Zero Sign Up. · Private. Runs On Your Phone · Aura Legend or Not? · Compare With Your Friends ·
Free Comedy Quiz, Adults Only · Get Your Verdict Now

**Descriptions (90 characters max):**
- Drop your lore, get a GOI score from 300 to 850 and a meme card for the group chat.
- No login, no tracking, answers never leave your phone. A comedy audit for adults 18+.
- Unlock badges from Touch Grass Certified to the top rank. Then challenge your friends.

## 4. What was implemented for SEO

| Item | Where |
|---|---|
| Keyword led title and meta description | `index.html` |
| Canonical URL, Open Graph and Twitter cards, `og:locale` en_US | `index.html` |
| Crawlable landing content in the raw HTML (headline, steps, badge names) | `index.html` `#root`, replaced by React on load |
| Age gate rendered as an overlay over the landing, so content is in the DOM | `src/App.tsx` |
| JSON-LD `WebApplication`, free offer, audience 18+ | `index.html` |
| `robots.txt` and `sitemap.xml` | `public/` |
| Static privacy and terms page | `public/privacy.html` |
| Web app manifest | `public/manifest.webmanifest` |
| US English spelling in visitor facing copy | `src/lib/copy/` |

After deploying: add the site to Google Search Console, submit `sitemap.xml`, and request indexing of
`/`. If you use a custom domain, update `SITE_URL`, `src/lib/site.ts`, `robots.txt`, `sitemap.xml`,
the canonical tags and the QR.

## 5. Performance and traffic

The site is fully static: Vercel serves it from its global CDN, so traffic spikes do not hit a server.
There is no backend, database or API to overload.

- Hashed JS, CSS and fonts in `/_app/` are cached for a year (`immutable`); images in `/assets/` for an hour.
- Only the Latin font subsets ship (four files, ~100 KB), with `font-display: swap`; the display and
  body fonts are preloaded by a build plugin.
- The landing content is in the raw HTML, so the first paint does not wait for JavaScript.
- The results screen (panels, card studio, PNG export) is a separate chunk fetched during the audit
  animation; the PNG renderer is a further lazy import.
- Images are WebP, sized per use, with lazy loading below the fold.
- Lighthouse was not run in this round. After deploying, run PageSpeed Insights on the live URL and
  check LCP under 2.5 s, INP under 200 ms and CLS under 0.1 on mobile.
- Main bundle: 469 KB (152 KB gzipped); results chunk 42 KB, loaded during the audit animation.
