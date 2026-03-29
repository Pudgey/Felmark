# Better Browser — Concept Document

> **Created**: 2026-03-28
> **Status**: Concept — Awaiting Decision
> **Thesis**: Chrome is a platform, not a product. Better Browser is the product layer Chrome refuses to build.

---

## The Insight

Chrome has 3.5 billion users and ~65% market share. It is also **the only major browser without built-in ad blocking, tab management, screenshots, reader mode, dark mode for web content, or session save/restore.**

Every competing browser — Arc, Brave, Vivaldi, Opera, Edge — has solved subsets of these problems natively. Chrome hasn't, and in some cases (ad blocking) **structurally can't** because Google makes $238B/yr from ads.

The result: the average Chrome user installs **8-12 extensions** but actively uses **2-3**. The rest are dormant security liabilities dragging performance. Users don't want 10 extensions. They want a better browser.

**Arc proved the demand** — 1M+ waitlist, $128M raised, $610M acquisition by Atlassian. But Arc failed on adoption because "reimagine the entire browser" was too complex for mainstream users.

**The gap nobody has filled**: A single, unified Chrome extension that bundles the essential browser improvements users currently hack together with 5-10 separate extensions. Every "all-in-one" extension today is an AI sidebar (Monica, Sider, HARPA). **Nobody has built the non-AI utility bundle.**

---

## What Chrome Is Missing

### The Competitive Matrix

| Feature | Chrome | Brave | Vivaldi | Opera | Edge | Arc (RIP) |
|---------|--------|-------|---------|-------|------|-----------|
| Built-in ad blocker | NO | YES | YES | YES | NO | YES |
| Tracker blocking | NO | YES | YES | YES | YES | Partial |
| Fingerprint protection | NO | YES | Partial | NO | NO | NO |
| Dark mode (web content) | NO | NO | YES | NO | NO | NO |
| Vertical tabs | 2026 (basic) | NO | YES | YES | YES | YES |
| Workspaces/Spaces | NO | NO | YES | YES | YES | YES |
| Tab hibernation | Basic | YES | YES | YES | YES | YES |
| Session save/restore | NO | NO | YES | YES | NO | YES |
| Split view | 2025 (basic) | NO | YES | NO | YES | YES |
| Built-in notes | NO | NO | YES | NO | YES | NO |
| Screenshot + annotate | NO | NO | YES | YES | YES | NO |
| Reader mode | NO | YES | YES | NO | YES | NO |
| Page customization | NO | NO | YES | NO | NO | YES (Boosts) |
| Sidebar apps | Basic | NO | YES | YES | YES | YES |
| RSS feeds | NO | YES | YES | NO | NO | NO |
| Whiteboard/canvas | NO | NO | NO | NO | NO | YES (Easel) |

Chrome is dead last in native features. The only reason people stay is ecosystem lock-in (Google account, sync, developer tools, compatibility).

### What Users Currently Install to Fix This

| Problem | Extensions Used | Combined Users |
|---------|----------------|---------------|
| Ad blocking | AdBlock, ABP, uBlock Origin Lite, Ghostery | ~120M+ |
| Dark mode | Dark Reader | 6M+ |
| Tab management | OneTab, Session Buddy, Tab Wrangler, Workona | ~9M+ |
| Screenshots | Awesome Screenshot, GoFullPage | ~7M+ |
| Reading | Mercury Reader, Pocket | ~4M+ |
| New tab | Momentum, Toby | ~4M+ |
| Privacy | Privacy Badger, ClearURLs, Cookie AutoDelete | ~5M+ |
| Page styling | Stylus, custom CSS | ~1M+ |

**That's 8 categories, 15+ extensions, and 150M+ combined installs solving problems the browser should solve natively.**

---

## The Product: Better Browser

### One Extension. Five Modules. Zero Bloat.

Better Browser is a single Chrome extension with a modular architecture. Users enable only what they need. Each module replaces 2-4 individual extensions.

```
┌─────────────────────────────────────────────┐
│              BETTER BROWSER                  │
│                                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ SHIELD  │ │ COMMAND │ │ STUDIO  │       │
│  │ Privacy │ │  Tabs   │ │  Tools  │       │
│  │& Blocks │ │& Spaces │ │& Notes  │       │
│  └─────────┘ └─────────┘ └─────────┘       │
│  ┌─────────┐ ┌─────────┐                    │
│  │  LENS   │ │  FLOW   │                    │
│  │ Content │ │  Perf   │                    │
│  │& Reader │ │& Memory │                    │
│  └─────────┘ └─────────┘                    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │         SIDE PANEL HUB              │    │
│  │   Unified settings + dashboard      │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

### Module 1: SHIELD (Privacy & Anti-Tracking)

**Replaces**: Privacy Badger, ClearURLs, Cookie AutoDelete, Ghostery (tracking features)
**Addressable users**: 10M+

| Feature | What It Does |
|---------|-------------|
| Tracker blocking | Block known third-party trackers and fingerprinting scripts |
| Fingerprint randomization | Randomize canvas, WebGL, audio context fingerprints |
| URL cleaning | Strip UTM params, tracking redirects, click IDs |
| Cookie auto-management | Auto-delete cookies per-site rules, whitelist trusted sites |
| Privacy dashboard | Weekly report: trackers blocked, cookies cleaned, fingerprint attempts |

**NOTE — NO AD BLOCKING.** Google created MV3 specifically to limit ad blockers. Shipping one inside Better Browser risks Chrome Web Store rejection or delisting. We stay on Google's good side by focusing on anti-tracking and privacy (which Chrome itself partially supports, signaling it's acceptable territory). Users who want ad blocking can pair Better Browser with a separate dedicated blocker.

**MV3 feasibility**: Fully viable. declarativeNetRequest for tracker blocking rules. Fingerprint randomization via content scripts. Cookie management via chrome.cookies API.

---

### Module 2: COMMAND (Tabs & Workspaces)

**Replaces**: OneTab, Session Buddy, Tab Wrangler, Workona, The Great Suspender
**Addressable users**: 10M+

| Feature | What It Does |
|---------|-------------|
| Workspaces | Named workspaces (like Arc Spaces) — switch contexts, each with own tabs/pins |
| Smart suspension | Auto-hibernate tabs after configurable idle time, show memory saved |
| Session save/restore | One-click save current window state, restore anytime, cloud sync |
| Tab search | Fuzzy search across all open tabs + recent history |
| Split view | Tile 2 tabs side-by-side in one window |
| Memory dashboard | Per-tab RAM/CPU usage, one-click suspend/close resource hogs |

**The vacuum**: The Great Suspender (2M users) was malware. OneTab (5M users) is notorious for losing data. Chrome added basic vertical tabs in Jan 2026 but no workspaces, no session save, no smart suspension.

**MV3 feasibility**: Fully viable. chrome.tabGroups, chrome.windows, chrome.storage for session persistence. Alarms API for periodic hibernation checks.

---

### Module 3: STUDIO (Productivity Tools)

**Replaces**: Awesome Screenshot, GoFullPage, Momentum, Pocket, Evernote Clipper
**Addressable users**: 15M+

| Feature | What It Does |
|---------|-------------|
| Screenshot + annotate | Full page or selection, draw/text/blur annotations, copy/save/share |
| Quick notes | Sidebar notepad — jot thoughts without leaving the page, tied to URL |
| Read later | Save articles to a clean reading list, sync across devices |
| Custom new tab | Configurable dashboard: recent tabs, bookmarks, notes, focus timer |
| Mini canvas | Simple whiteboard in Side Panel (inspired by Arc's Easel) |

**Why this matters**: Edge, Vivaldi, and Opera all have built-in screenshots. Chrome has... nothing. Users install 4-6 separate tools for basic productivity.

**MV3 feasibility**: Fully viable. chrome.tabCapture for screenshots. Side Panel API for notes/canvas. chrome.storage for read-later list.

---

### Module 4: LENS (Content Enhancement)

**Replaces**: Dark Reader, Mercury Reader, Stylus, Video Speed Controller
**Addressable users**: 10M+

| Feature | What It Does |
|---------|-------------|
| Universal dark mode | Dark theme for every website (Dark Reader has 6M+ users alone) |
| Reader mode | Strip page to clean, readable text + images (Chrome removed this) |
| Page customization | Simple CSS overrides per site — hide elements, change fonts/colors (a la Arc Boosts) |
| Video controls | Speed control, PiP, skip silence for any HTML5 video |
| RSS support | Detect and subscribe to RSS feeds on any page |

**The Arc Boosts angle**: Arc's most beloved feature was Boosts — letting users customize any website's appearance. Arc is dead. This feature has no home. Better Browser inherits it.

**MV3 feasibility**: Fully viable. Content scripts for dark mode, reader mode, and CSS injection. Side Panel for RSS reader.

---

### Module 5: FLOW (Performance & Memory)

**Replaces**: Auto Tab Discard, performance monitoring extensions
**Addressable users**: 5M+

| Feature | What It Does |
|---------|-------------|
| Resource dashboard | Visual per-tab memory/CPU usage (Chrome's Task Manager is hidden and ugly) |
| Smart hibernation | Rules-based: "suspend tabs from youtube.com after 30 min idle" |
| Battery saver | Reduce background activity, lower animation frame rates |
| Extension audit | Flag installed extensions by permission scope, update frequency, risk |

**MV3 feasibility**: Partially viable. Tab discard via chrome.tabs.discard(). Resource monitoring is limited — may need estimation heuristics rather than exact readings.

---

## The Web App Expansion

The extension is the **free acquisition channel**. The web app is the **paid product**.

### What the Web App Does

| Feature | Value |
|---------|-------|
| **Cross-device sync** | Workspaces, sessions, notes, read-later list — synced everywhere |
| **Browsing analytics** | Weekly focus reports, time-per-site trends, productivity scores |
| **Team workspaces** | Shared tab sessions, collaborative notes, team bookmarks |
| **Settings backup** | Export/import all Better Browser configs |
| **Privacy reports** | Monthly report: trackers blocked, cookies managed, fingerprint attempts |
| **Extension health** | Dashboard showing which of your OTHER extensions are risky/outdated |

### Pricing

| Tier | Price | What You Get |
|------|-------|-------------|
| **Free** | $0 | All 5 modules, local storage only |
| **Pro** | $6/mo or $48/yr | Cross-device sync, browsing analytics, cloud backup |
| **Team** | $4/user/mo | Shared workspaces, team notes, admin controls |

**Why this pricing works**:
- Free tier is genuinely useful (replaces 5-10 extensions for $0)
- Pro is cheaper than the extensions it replaces (Dark Reader asks for donations, Workona is $7/mo, Momentum Plus is $3.33/mo)
- Team tier targets remote teams who need shared browser workspaces

---

## Market Sizing

### Bottom-Up

| Segment | Users | Conversion | ARPU | Revenue |
|---------|-------|-----------|------|---------|
| Free users | 500K | — | $0 | $0 |
| Pro converts (5%) | 25K | 5% | $48/yr | $1.2M/yr |
| Team converts (1%) | 5K users | 1% | $48/yr | $240K/yr |
| **Total at 500K free** | | | | **$1.44M/yr** |

### Top-Down

- Chrome extensions that Better Browser replaces have **150M+ combined installs**
- Even capturing **0.1%** = 150K users
- At 5% conversion to Pro = 7,500 paying users = **$360K/yr**
- At 1% of addressable = 1.5M users, 5% conversion = 75K paying = **$3.6M/yr**

### Comparable Exits/Revenue

| Company | What It Did | Outcome |
|---------|------------|---------|
| Arc / Browser Company | "Better browser" as a whole browser | $610M acquisition (Atlassian) |
| Honey | Price comparison extension | $4B acquisition (PayPal) |
| Momentum | Custom new tab | ~$1M/yr revenue |
| Workona | Tab/workspace management | ~$500K+ ARR, VC-funded |
| Ghostery | Privacy/ad blocking | Acquired, relaunched as subscription |

---

## Why NOW

### 1. Manifest V3 Created a Vacuum
- MV3 killed or degraded dozens of popular extensions (not just ad blockers)
- Privacy tools, tab managers, cookie managers, session savers all died or stalled
- Users are actively searching for MV3-native replacements
- A well-designed MV3-native suite captures massive share across multiple categories

### 2. Arc Proved Demand But Failed on Reach
- 1M+ waitlist, $128M raised, $610M exit
- Innovations (Spaces, Boosts, Easel) were beloved
- Failed because "whole new browser" was too much friction
- Better Browser brings Arc's best ideas to Chrome's 3.5B users via an extension

### 3. Extension Fatigue Is Real
- Users have 8-12 extensions, use 2-3
- 60% never remove unused extensions
- Performance degrades measurably with 10+ extensions
- A single trusted extension reduces attack surface and resource drain

### 4. The All-in-One Non-AI Utility Bundle Is Unoccupied
- Every all-in-one extension today is an AI sidebar (Monica, Sider, HARPA)
- Nobody has built the non-AI browser utility bundle
- The category is wide open

### 5. Chrome Will Never Fix This
- Ad blocking conflicts with Google's $238B ad business
- Chrome's feature additions are glacially slow (vertical tabs took 5+ years of requests)
- Google is focused on AI features (Gemini), not browser utilities
- The gap between Chrome and competitors is growing, not shrinking

---

## Competitive Landscape

### Direct Competitors (None Exist)

No single Chrome extension currently bundles privacy + tab management + productivity tools + content enhancement + performance management.

### Adjacent Competitors

| Competitor | What They Do | Why Better Browser Wins |
|-----------|-------------|----------------------|
| **Monica/Sider/HARPA** | AI sidebar (chat, summarize) | Different category — AI assistant, not browser utility |
| **Workona** ($7/mo) | Tab workspaces only | Better Browser includes workspaces + 4 other modules for less |
| **Dark Reader** (donations) | Dark mode only | Better Browser includes dark mode + 4 other modules |
| **OneTab** (free) | Tab collapse only | Unreliable (loses data), no workspaces, no sync |
| **uBlock Origin Lite** (free) | Ad blocking only (degraded) | Better Browser adds privacy dashboard + cookie management + fingerprint protection |
| **Brave browser** | Better browser (whole product) | Requires switching browsers — Better Browser works inside Chrome |
| **Vivaldi** | Feature-rich browser | Requires switching browsers |

**The key advantage**: Better Browser doesn't ask users to switch browsers. It makes the browser they already use — Chrome — better. Zero friction.

---

## Technical Architecture

### MV3 Extension Structure

```
better-browser/
├── manifest.json (MV3)
├── service-worker.js (ES module, imports per-module handlers)
├── side-panel/
│   ├── hub.html (main dashboard)
│   ├── notes.html
│   ├── reader.html
│   └── canvas.html
├── modules/
│   ├── shield/ (declarativeNetRequest rules, content scripts for fingerprint)
│   ├── command/ (tab management, workspace state, session logic)
│   ├── studio/ (screenshot capture, notes storage, read-later)
│   ├── lens/ (dark mode injection, reader mode, CSS overrides)
│   └── flow/ (tab discard logic, resource estimation)
├── content-scripts/
│   ├── shield-blocker.js
│   ├── lens-darkmode.js
│   ├── lens-reader.js
│   └── lens-boosts.js
├── rules/ (declarativeNetRequest JSON rulesets)
├── popup/
│   └── quick-settings.html (module toggles, quick stats)
└── assets/
```

### Key Technical Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Service worker architecture | ES modules with per-module imports | Modular, maintainable, MV3-native |
| Tracker blocking approach | declarativeNetRequest (focused tracker rules) | MV3-compliant, performant, avoids ad-block territory |
| Dark mode | Content script CSS injection | Same approach as Dark Reader, proven at scale |
| Tab management | chrome.tabGroups + chrome.storage | Native APIs, reliable session persistence |
| Side Panel | chrome.sidePanel API | Persistent UI for notes, reader, canvas, dashboard |
| Sync | Cloud backend (own server or Firebase) | Cross-device sync for Pro tier |
| Permissions | Modular — only request what's needed per enabled module | Reduces permission anxiety |

### MV3 Constraints & Mitigations

| Constraint | Impact | Mitigation |
|-----------|--------|-----------|
| Service worker lifecycle | No persistent background state | Alarms API for periodic tasks, chrome.storage for state |
| 330K rule limit | Sufficient for most ad blocking but less than uBlock Origin's 300K+ | Optimize filter lists, prioritize most-impactful rules |
| No remote code execution | Can't update rules from server dynamically | Bundle optimized rulesets, update via extension updates |
| Per-site permissions | Users must grant access | Use activeTab where possible, explain permissions clearly |

---

## Go-To-Market

### Phase 1: Launch Shield + Command (Months 1-3)
- **Shield** (privacy/blocking) captures the MV3 vacuum — millions of angry ex-uBlock users
- **Command** (tab management) solves Chrome's #1 complaint
- Free on Chrome Web Store
- Launch on ProductHunt, Hacker News, r/chrome, r/privacy
- Target: 50K users in 90 days

### Phase 2: Add Studio + Lens (Months 3-6)
- Complete the core module set
- Introduce Pro tier ($6/mo) with cross-device sync
- Content marketing: "Replace 10 extensions with 1"
- Target: 200K users, 2% Pro conversion = 4K paying = $24K MRR

### Phase 3: Web App + Teams (Months 6-12)
- Launch web dashboard for analytics, sync management, team features
- Team tier ($4/user/mo) targeting remote teams
- Partnership/review outreach to productivity YouTubers and tech blogs
- Target: 500K users, 5% conversion = 25K paying = $100K MRR

### Phase 4: Multi-Browser + Mobile (Year 2)
- Port to Firefox, Edge (different extension stores, same core)
- Mobile companion app (sync reading list, notes, workspaces)
- Enterprise tier for companies wanting managed browser configs

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Chrome adds native features that overlap | Medium | Medium | Modular design — disable modules that become redundant, add new differentiators |
| Google rejects from Web Store (too broad permissions) | Low-Med | High | Modular permissions, clear privacy policy, apply for "Featured" badge |
| Performance impact of bundling many features | Medium | High | Aggressive optimization, lazy loading, only activate enabled modules |
| User overwhelm (too many features) | Medium | Medium | Clean onboarding: pick your modules, progressive disclosure |
| Google perceives extension as competitive threat | Low | High | No ad blocking — stay in privacy/productivity lanes Google tolerates |
| Competing all-in-one launches | Low | Medium | First mover advantage + community building |

---

## The One-Liner

**Better Browser: The browser Chrome should have been. One extension. Every feature Chrome is missing. No switching required.**

---

## Sources

- [Chrome market share: ~65%, 3.5B users](https://www.aboutchromebooks.com/chrome-extension-ecosystem/)
- [Arc Browser: 1M+ waitlist, $128M raised, $610M Atlassian acquisition](https://techcrunch.com/2025/05/27/the-browser-company-mulls-selling-or-open-sourcing-arc-browser-amid-ai-focused-pivot/)
- [Average user has 8-12 extensions, uses 2-3](https://www.debugbear.com/blog/chrome-extension-statistics)
- [60% never remove extensions](https://www.aboutchromebooks.com/unused-chrome-extension-statistics-2026/)
- [uBlock Origin dead on Chrome July 2025](https://getblockify.com/blog/why-ublock-origin-was-removed-from-chrome/)
- [Google ad revenue $238B](https://abc.xyz/investor/)
- [Honey acquired for $4B by PayPal](https://www.paypal.com/us/webapps/mpp/honey)
- [declarativeNetRequest 330K rule limit](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest)
- [Monica AI pricing](https://monica.im/pricing)
- [Sider AI 2M+ users](https://www.thetoolsverse.com/tools/sider)
- [HARPA AI 500K users](https://chromewebstore.google.com/detail/harpa-ai-web-automation-w/eanggfilgoajaocelnaflolkadkeghjp)
- [Vivaldi built-in features](https://vivaldi.com/features/)
- [Opera vs Chrome](https://www.opera.com/opera/compare/chrome)
- [Edge vertical tabs](https://www.microsoft.com/en-us/edge/features/vertical-tabs)
- [Sidekick acquired by Perplexity, shut down](https://www.hostcheetah.com/t/perplexity-acquires-sidekick-browser-july-2025/1304)
- [Chrome MV3 migration guide](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
- [Extensions performance impact](https://www.debugbear.com/blog/chrome-extensions-website-performance)
- [AI extension market $2.3B, 22.5% CAGR](https://zovo.one/research/chrome-extension-market-report)
