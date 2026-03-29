# MV3Phoenix Playbook — Deep Dive

> **Created**: 2026-03-28
> **Purpose**: Full research report on the expired Chrome extensions opportunity

---

## The Landscape

| Metric | Number |
|--------|--------|
| Extensions removed (MV2 cleanup) | ~25,000-84,000 |
| Chrome Web Store peak (2020) | 137,345 |
| Current active extensions | ~111,933 |
| Users displaced | 426 million |
| Extensions without updates in 12 months | ~60% of store |
| Users exposed to outdated code | ~350 million |
| Chrome 139 (July 2025) | Permanently disabled all remaining MV2 extensions |

---

## The Dataset — Where to Get It

### Option 1: Chrome Goldmine ($19-59)
- **Creator**: Raf Vantongerloo
- **Contents**: 9,656 expired extensions with metadata (name, URL, user count, rating, rating count, dates, category)
- **Extras**: Revenue projections, 60-page research report, 10+ implementation manuals, Notion database + CSV
- **Buyers**: 500+ indie makers, 127 reviews at 4.9/5
- **Source**: chromegoldmine.com

### Option 2: Gumroad Budget Version ($3.99)
- **Creator**: hiren1137
- **Contents**: 4,777 expired extensions
- **Filter criteria**: 500+ users, 3.5+ stars, 10+ reviews
- **Includes**: CSV + JSON + 3-page revival guide

### Option 3: Free Raw Data
- **Palant's dataset** (GitHub/Codeberg): Manifest files for 100K+ Chrome extensions
- Raw data you'd need to filter yourself, but it's free
- Includes name, publisher, rating, user count, permissions

---

## Revenue Benchmarks — What Extensions Actually Earn

| Extension | Revenue | Model | Notes |
|-----------|---------|-------|-------|
| GMass | $200K/mo ($5.4M/yr) | $8-20/mo sub | Gmail power tool |
| Closet Tools | $42K/mo | $30/mo sub | Poshmark niche |
| Momentum | $996K/yr | $4.95/mo | Dashboard replacement |
| Eightify | $45K/mo | AI subscription | YouTube summaries |
| Browserless | $28K/mo | Solo founder, $500 startup | Automation |
| Mate Translate | $18K/mo | Solo founder, $0 startup | 800K MAU |
| GoFullPage | $10K/mo | Free + $1/mo premium | 4M users |
| Sync2Sheets | $9K/mo MRR | Built in 2 weeks, $0 cost | 400 paying customers |
| RatePunk | $600K/yr | Hotel prices | 3K+ users in weeks |
| Night Eye | $3.1K/mo | Freemium | Dark mode |
| Weather Extension | $2.5K/mo | Free + $9.99 premium | 200K+ users |

**Industry averages**: Successful extensions = $862K/yr, 70-85% profit margins, 40-60x monthly profit for exits.

**Reality check**: 86.3% of extensions have <1,000 users. Median installs = 17. Only 0.24% (242 extensions) exceed 1M users. Extreme power-law distribution.

---

## What MV3 Broke (Technical)

| MV2 Capability | MV3 Replacement | What Was Lost |
|---|---|---|
| webRequest blocking API | declarativeNetRequest (static rules) | Dynamic request evaluation, unlimited rules, real-time decisions |
| Persistent background pages | Service workers (ephemeral) | Long-running state, persistent connections, always-on monitoring |
| Remote code execution (eval, remote JS) | All code must be bundled | Dynamic rule updates, server-driven logic, live patching |
| Unlimited filter rules | 30K static / 5K dynamic rule cap | Large filter lists (uBlock needed 300K+) |
| Broad host permissions | Per-site grants, activeTab | Blanket access to all page content |

**Workarounds that exist**: Offscreen Documents (DOM access), sandboxed iframes (eval-like), userScripts API (Chrome 120), WebSocket connections (keep service workers alive), alarms API (periodic tasks).

**What is genuinely dead**: Full-power ad blocking (300K+ rules), deep real-time network inspection/modification, persistent background DOM manipulation, remote code execution.

---

## Categories Ranked by Opportunity

### Sweet Spot: Open Gap + Monetizable + Rebuildable

| Rank | Category | Gap Size | Competition | Monetization | Rebuildable? |
|------|----------|----------|-------------|-------------|-------------|
| 1 | **Parental Controls** | 1-3M users displaced | LOW | HIGH ($5-10/mo, parents pay) | Partially (content scripts + declarativeNetRequest hybrid) |
| 2 | **Cookie Managers** | 3-5M users displaced | LOW-MOD | MOD (dev tooling angle) | YES (chrome.cookies API works) |
| 3 | **Session/Tab Managers** | 1-3M users displaced | LOW | MOD ($3-8/mo) | YES (chrome.storage + alarms) |
| 4 | **Privacy Utility Bundles** | 5-10M displaced across niche tools | MOD | MOD-HIGH (VPN-adjacent) | Mostly yes |
| 5 | **Dev Tools (lightweight)** | 2-4M displaced | MOD | HIGH ($5-20/mo, devs pay) | Partially |

### Filled Gaps (Don't Bother)

| Category | Why It's Taken |
|----------|---------------|
| Ad blockers | AdGuard, Ghostery, uBlock Origin Lite all rebuilt. Plus users expect free. |
| Major privacy tools | Ghostery, Privacy Badger adapted |
| Premium dev tools | Requestly owns the high end |

### Specific High-Profile Dead Extensions

| Extension | Users Before | Revenue | What Happened |
|-----------|-------------|---------|---------------|
| uBlock Origin | 10M+ | Free | Removed. uBlock Origin Lite (MV3) is weaker. |
| EditThisCookie | Millions | Free | Removed. Malicious copycat appeared in its place. |
| SpeechNotesX | Listed at $791K revenue estimate | $3.99/mo | Removed. Replacement "SpeechNotes" exists but only 2K users at $5.99/mo. |
| Open SEO Stats | 100K | $3.99/mo | Removed. |

---

## Who's Already Doing This

| Player | Approach | Results |
|--------|----------|---------|
| **Raf Vantongerloo** | Selling the dataset itself (Chrome Goldmine) | 500+ buyers at $19-59 each |
| **"Alex" (indie hacker)** | Used dataset, identified 47 productivity gaps, launched 3 extensions | One reached 2,500+ users |
| **"Maria" (SaaS builder)** | Built a 50-page review/comparison site for expired extensions | Ranked #1 for 12 keywords, $3K/mo affiliate revenue |
| **Baxter Inc.** | Acquired abandoned Gmail Unsubscribe extension | $1K+/mo MRR within 9 months |
| **T.LY (Tim Leland)** | Rebuilt when Google killed its URL shortener | 350K+ users, 8M+ URLs, $2.6K/mo |
| **Nihal (Indie Hackers)** | Offering Chrome extension dev as a service | Building for clients who want to claim expired niches |

---

## Risks — Be Clear-Eyed

1. **Google's duplicate detection** can flag and remove extensions too similar to existing/removed ones. You can't just clone and republish.
2. **The $862K/yr average is misleading** — that's successful extensions only. Median installs = 17. Power-law distribution.
3. **Competition from other playbook runners**: 500+ people bought Chrome Goldmine. Easy wins get crowded fast.
4. **Copyright concerns**: Chrome extension code is inspectable but that doesn't mean you have a license to fork it.
5. **Revenue projections in the dataset are estimates**, not verified data.
6. **MV3 security is weaker than Google claims**: 56% of malicious extensions retained capabilities after MV3 migration.

---

## Three Execution Strategies

### Strategy A: Build from the Graveyard
- Buy the dataset ($4-59)
- Filter for: high users, high ratings, monetized, rebuildable under MV3
- Pick 3-5 targets in different categories
- Rebuild as MV3-native with improvements based on original reviews
- Capture orphaned search traffic
- **Timeline**: 2-4 weeks per extension MVP
- **Target**: $5-15K MRR across portfolio

### Strategy B: Acquire Abandoned Extensions
- Find extensions that still exist but haven't been updated in 12+ months (60% of the store)
- Contact the developers, offer to buy for $500-2,000
- Get the existing user base + store listing + SEO
- Update to MV3, improve, monetize
- **Example**: Baxter Inc. did this → $1K+/mo in 9 months
- **Timeline**: Faster than building — you inherit users day 1

### Strategy C: The Affiliate Content Play
- Don't build extensions at all
- Build a comparison/review site for categories where extensions died
- "Best alternatives to [dead extension] in 2026"
- Monetize with affiliate links to surviving extensions
- **Example**: "Maria" → $3K/mo with a 50-page site
- **Timeline**: 1-2 weeks to launch, SEO takes 3-6 months

---

## Sources

- [Chrome Goldmine](https://chromegoldmine.com/)
- [Raf Vantongerloo - Stackademic](https://blog.stackademic.com/how-i-found-9650-expired-chrome-extensions-goldmine-manifest-v3-opportunities-c90d36f99045)
- [Raf Vantongerloo - Medium Analysis](https://medium.com/startup-insider-edge/i-analyzed-9-650-expired-chrome-extensions-heres-what-the-data-reveals-87426d1abb98)
- [Indie Hackers - Extensions Disappearing](https://www.indiehackers.com/post/software-opportunity-thousands-of-chrome-extensions-are-about-to-disappear-85DQAl9yaLglihq0kkkP)
- [Indie Hackers - Chrome Goldmine](https://www.indiehackers.com/post/dfy-chrome-goldmine-find-build-your-next-100k-chrome-extension-all-research-done-R8uwBDeQ9mY1WLlH10Yq)
- [ExtensionPay - Revenue Examples](https://extensionpay.com/articles/browser-extensions-make-money)
- [StarterStory - Success Stories](https://www.starterstory.com/ideas/chrome-extension/success-stories)
- [Chrome Extension Ecosystem 2026](https://www.aboutchromebooks.com/chrome-extension-ecosystem/)
- [DebugBear - Extension Statistics](https://www.debugbear.com/blog/counting-chrome-extensions)
- [arXiv - MV3 Impact on Ad Blockers](https://arxiv.org/html/2503.01000)
- [Chrome MV3 Known Issues](https://developer.chrome.com/docs/extensions/develop/migrate/known-issues)
- [Palant's Dataset (Codeberg)](https://github.com/palant/chrome-extension-manifests-dataset)
- [Gumroad - 4,777 Expired Extensions ($3.99)](https://hiren1137.gumroad.com/l/build-that-extension)
- [Kaspersky - 87M Malicious Extension Downloads](https://usa.kaspersky.com/blog/dangerous-chrome-extensions-87-million/28561/)
- [Palant - Chrome Web Store is a Mess](https://palant.info/2025/01/13/chrome-web-store-is-a-mess/)
- [Chrome declarativeNetRequest API](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest)
