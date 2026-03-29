# Better Browser -- Chrome Gap Research

**Date:** 2026-03-28
**Purpose:** Identify what Chrome is fundamentally missing that users hack together with extensions, and what competing browsers do natively that Chrome does not.

---

## Executive Summary

Chrome dominates with ~65% market share but has glaring feature gaps that force the average user to install 8-12 extensions (while only actively using 2-3). Competing browsers -- Arc, Brave, Vivaldi, Opera, and Edge -- each solve subsets of these gaps natively. The opportunity: a single "Better Browser" extension suite that replaces 5-10 individual extensions and brings Chrome to feature parity with the best of its competitors.

The biggest gaps cluster into **6 mega-categories**:
1. **Ad/Tracker Blocking & Privacy** (largest extension category by users)
2. **Tab Management & Organization** (most persistent complaint)
3. **Productivity Tools** (split view, notes, screenshots, read later)
4. **UI Customization** (vertical tabs, sidebar, dark mode, custom new tab)
5. **Performance & Memory** (tab suspension, battery saver)
6. **Content Enhancement** (reader mode, clean URLs, page customization)

---

## 1. AD BLOCKING & PRIVACY

### The Gap
Chrome has NO built-in ad blocker, tracker blocker, or fingerprint protection. It is the ONLY major browser without these features. Worse, Chrome's Manifest V3 transition (fully enforced July 2025) actively crippled the best third-party ad blockers.

### What Competitors Do Natively

| Feature | Brave | Vivaldi | Opera | Edge | Firefox |
|---------|-------|---------|-------|------|---------|
| Built-in ad blocker | Yes (Shields) | Yes | Yes | No | Enhanced Tracking Protection |
| Tracker blocking | Yes (aggressive) | Yes | Yes | Tracking Prevention | Yes |
| Fingerprint protection | Yes (randomization) | Partial | No | No | Yes |
| Built-in VPN | No (paid add-on) | No | Yes (free) | No | No (paid) |
| Cookie management | Yes (blocks cross-site) | Yes | Yes | Yes | Yes (Total Cookie Protection) |
| Bounce tracking protection | Yes (pioneered) | No | No | No | Yes |
| Clean URLs (strip tracking params) | Yes | No | No | No | No |

### Extensions Users Currently Install

| Extension | Users | What It Does |
|-----------|-------|-------------|
| Ad Block | ~67M | Block ads |
| AdBlock Plus | ~37-46M | Block ads |
| uBlock Origin (now Lite) | ~29M (original), ~16M (Lite) | Block ads, trackers, miners |
| Ghostery | ~7M+ | Tracker blocking, privacy |
| Privacy Badger | ~3M+ | Tracker blocking (EFF) |
| ClearURLs | ~1M+ | Strip tracking parameters from URLs |
| HTTPS Everywhere | ~10M+ (now deprecated, built into browsers) | Force HTTPS |
| Cookie AutoDelete | ~1M+ | Auto-delete cookies |

### Manifest V3 Impact
- uBlock Origin (full version) is DEAD on Chrome as of July 2025
- uBlock Origin Lite is a degraded replacement
- AdBlock Plus lost ~7M users during transition
- EFF calls MV3 "deceitful and threatening"
- Users who want full ad blocking are told to switch to Firefox
- This is a MASSIVE opportunity -- users are angry and looking for solutions

### Better Browser Opportunity
**HIGH PRIORITY.** A privacy/blocking module that works within MV3 constraints but combines ad blocking + tracker blocking + fingerprint protection + clean URLs + cookie management into ONE extension would replace 3-5 separate extensions.

---

## 2. TAB MANAGEMENT & ORGANIZATION

### The Gap
Chrome's tab management is its single most criticized feature. Users accumulate dozens/hundreds of tabs, the horizontal tab strip becomes unusable, and Chrome offers no native way to save sessions, suspend tabs to free memory, or organize tabs into workspaces.

Chrome added vertical tabs in January 2026 and tab groups earlier, but both are bare-bones compared to competitors.

### What Competitors Do Natively

| Feature | Arc | Vivaldi | Opera | Edge |
|---------|-----|---------|-------|------|
| Vertical tabs | Yes (sidebar, core UX) | Yes | Yes | Yes (best implementation) |
| Workspaces/Spaces | Yes (Spaces -- each with own theme, pinned tabs, bookmarks) | Yes (Tab Stacks) | Yes (Tab Islands + Workspaces) | Yes (Workspaces) |
| Tab suspension/hibernation | Yes (auto-archives after 12h) | Yes (Tab Hibernation) | Yes (Battery Saver pauses bg tabs) | Yes (Sleeping Tabs) |
| Session save/restore | Yes (built-in) | Yes | Yes | Yes |
| Split view | Yes (2-4 panes, Cmd+Shift+D) | Yes (tile 2-4 tabs) | Yes | Yes |
| Tab search | Yes | Yes (Quick Commands) | Yes | Yes |
| Tab preview on hover | Basic | Yes | Yes (shows related tabs from same site) | Yes |
| Tab emojis/labels | No | No | Yes (Tab Emojis) | No |

### Extensions Users Currently Install

| Extension | Users | What It Does |
|-----------|-------|-------------|
| OneTab | ~5M+ | Convert all tabs to a list, restore later |
| Session Buddy | ~2M+ | Save/restore tab sessions |
| Tab Session Manager | ~1M+ | Save/restore sessions with autosave |
| The Great Suspender | ~2M+ (now dead -- was malware) | Suspend inactive tabs to save RAM |
| Tab Wrangler | ~500K+ | Auto-close inactive tabs |
| Workona | ~500K+ | Workspaces for tabs |
| Toby | ~500K+ | Visual tab organizer (replaces new tab) |

### Better Browser Opportunity
**HIGHEST PRIORITY.** This is Chrome's biggest pain point. A tab management module that combines: workspaces/spaces + tab suspension + session save/restore + split view + tab search would replace 3-5 extensions and match what Arc/Vivaldi do natively. The death of The Great Suspender (malware) and OneTab's reliability issues (loses tabs) leave a vacuum.

---

## 3. PRODUCTIVITY TOOLS

### The Gap
Chrome is a passive window into the web. Competing browsers treat the browser as a productivity workspace with built-in notes, screenshots, whiteboards, reading lists, and sidebar apps.

### What Competitors Do Natively

| Feature | Arc | Vivaldi | Opera | Edge |
|---------|-----|---------|-------|------|
| Built-in notes | No | Yes (Notepad with screenshots, file attachments) | No | Yes (Edge Sidebar notes) |
| Screenshot + annotation | No | Yes (Capture Page button, full-page or selection) | Yes (Snapshot tool) | Yes (Web Capture with markup) |
| Whiteboard/canvas | Yes (Easel -- infinite board) | No | No | No |
| Sidebar apps/panels | Yes | Yes (customizable side panel) | Yes (Messenger, WhatsApp, Telegram, Slack, Discord built-in) | Yes (Bing Chat, apps) |
| Reading mode | No | Yes (Reader View) | No | Yes (Immersive Reader) |
| Read later / reading list | Basic | Yes | Yes | Yes (Collections) |
| Picture-in-Picture | Basic (Chrome has this) | Yes | Yes (Video Pop Out) | Yes |
| Floating panels | No | Yes | No | Yes |

### Extensions Users Currently Install

| Extension | Users | What It Does |
|-----------|-------|-------------|
| Evernote Web Clipper | ~4M+ | Save pages, annotate |
| Notion Web Clipper | ~3M+ | Save to Notion |
| Awesome Screenshot | ~3M+ | Screenshot + annotate |
| GoFullPage | ~4M+ | Full page screenshots |
| Mercury Reader | ~1M+ | Reader mode / distraction-free reading |
| Pocket (Save to Pocket) | ~3M+ | Save articles for later |
| Momentum | ~3M+ | Custom new tab with focus/to-do |

### Better Browser Opportunity
**HIGH PRIORITY.** A productivity module combining: screenshot + annotation + notes sidebar + reader mode + read later would replace 4-6 extensions. The whiteboard/Easel concept from Arc is unique and beloved -- could be a differentiator.

---

## 4. UI CUSTOMIZATION & APPEARANCE

### The Gap
Chrome's UI is rigid. No native dark mode for web content (only the browser chrome itself), no custom new tab page, limited sidebar functionality, and the overall look is utilitarian.

### What Competitors Do Natively

| Feature | Arc | Vivaldi | Opera |
|---------|-----|---------|-------|
| Dark mode for ALL web content | No | Yes (page filter effects: grayscale, invert, sepia, etc.) | No |
| Custom themes per workspace | Yes (each Space has its own color) | Yes (extensive) | Yes |
| Page customization (CSS injection) | Yes (Boosts -- change colors, fonts, zap elements on ANY site) | No | No |
| Custom new tab | Yes (completely reimagined) | Yes (Speed Dial) | Yes (Speed Dial) |
| Custom keyboard shortcuts | Basic | Yes (fully customizable hotkeys) | Basic |
| Page filter effects | No | Yes (Grayscale, B&W, Invert, Obscure, Sepia) | No |

### Extensions Users Currently Install

| Extension | Users | What It Does |
|-----------|-------|-------------|
| Dark Reader | ~6M+ | Dark mode for every website |
| Stylus | ~1M+ | Custom CSS for any website |
| Tampermonkey | ~10M+ | Custom JavaScript on any page |
| Momentum | ~3M+ | Replace new tab page |
| New Tab Redirect | ~500K+ | Custom new tab |
| Vimium | ~1M+ | Keyboard navigation for Chrome |

### Better Browser Opportunity
**MEDIUM-HIGH PRIORITY.** Dark mode alone (Dark Reader has 6M+ users) is a huge draw. Combining dark mode + page customization (a la Arc Boosts) + custom new tab into one module would be compelling. The Arc Boosts concept is particularly interesting -- letting users customize any website's appearance.

---

## 5. PERFORMANCE & MEMORY MANAGEMENT

### The Gap
Chrome's RAM hunger is its most persistent complaint. Its multi-process architecture means each tab is a separate process, and Chrome does minimal automatic resource management. Chrome added some tab discarding, but it's aggressive (tabs fully reload when you return) and not user-controllable.

### What Competitors Do Natively

| Feature | Arc | Vivaldi | Opera | Edge | Brave |
|---------|-----|---------|-------|------|-------|
| Tab sleeping/hibernation | Yes (auto-archive after 12h) | Yes (individual + stack hibernation) | Yes (via Battery Saver) | Yes (Sleeping Tabs) | Yes |
| Battery saver mode | No | No | Yes (35% longer battery) | Yes (Efficiency mode) | No |
| RAM usage | ~40% less than Chrome | Less than Chrome | Less than Chrome | Less than Chrome | Less than Chrome |
| Background process control | Yes | Yes | Yes | Yes | Yes |

### Extensions Users Currently Install

| Extension | Users | What It Does |
|-----------|-------|-------------|
| The Great Suspender Original (dead) | Was ~2M | Suspend tabs |
| Auto Tab Discard | ~500K+ | Automatically discard inactive tabs |
| Tab Suspender | ~500K+ | Suspend tabs to free memory |
| OneTab | ~5M+ | Collapse all tabs to list (frees memory) |

### Better Browser Opportunity
**MEDIUM PRIORITY.** Tab suspension is mostly solved by the tab management module. A dedicated performance dashboard showing per-tab memory/CPU usage, with one-click suspend and smart auto-hibernation rules, would be valuable. Chrome's built-in Task Manager is hidden and not actionable.

---

## 6. CONTENT ENHANCEMENT

### The Gap
Chrome does minimal content enhancement. No built-in reader mode (removed the flag), no smart page summarization (Gemini is separate), no translation overlay (Google Translate extension needed), weak download management.

### What Competitors Do Natively

| Feature | Arc | Vivaldi | Edge | Brave |
|---------|-----|---------|------|-------|
| Reader mode | No | Yes | Yes (Immersive Reader -- best-in-class) | Yes (SpeedReader) |
| Page translation | No | No | Yes (Microsoft Translator) | No |
| PDF tools | No | No | Yes (built-in PDF editor) | No |
| Video popup/PiP | Basic | Yes | Yes | No |
| RSS feeds | No | Yes (Feed Reader) | No | Yes (Brave News) |

### Extensions Users Currently Install

| Extension | Users | What It Does |
|-----------|-------|-------------|
| Google Translate | ~40M | Translate pages |
| Mercury Reader / Reader View | ~1M+ | Distraction-free reading |
| Video Speed Controller | ~2M+ | Control video playback speed |
| Enhancer for YouTube | ~2M+ | YouTube improvements |
| RSS feed readers (various) | ~1-2M combined | RSS support |

### Better Browser Opportunity
**MEDIUM PRIORITY.** Reader mode + smart page cleanup + enhanced download management. The RSS angle is interesting -- "every browser should support RSS feeds, it's a fundamental web standard."

---

## COMPETITIVE BROWSER FEATURE MATRIX (Summary)

| Feature Category | Chrome | Arc | Brave | Vivaldi | Opera | Edge |
|-----------------|--------|-----|-------|---------|-------|------|
| Built-in ad blocker | NO | Yes* | YES | YES | YES | NO |
| Tracker blocking | NO | Partial | YES | YES | YES | YES |
| Fingerprint protection | NO | NO | YES | Partial | NO | NO |
| Free VPN | NO | NO | NO | NO | YES | NO |
| Vertical tabs | 2026 (basic) | YES | NO | YES | YES | YES |
| Workspaces/Spaces | NO | YES | NO | YES | YES | YES |
| Tab hibernation | Basic | YES | YES | YES | YES | YES |
| Session save/restore | NO | YES | NO | YES | YES | NO |
| Split view | 2025 (basic) | YES | NO | YES | NO | YES |
| Built-in notes | NO | NO | NO | YES | NO | YES |
| Screenshot + annotate | NO | NO | NO | YES | YES | YES |
| Reader mode | NO | NO | YES | YES | NO | YES |
| Dark mode (content) | NO | NO | NO | YES | NO | NO |
| Page customization | NO | YES (Boosts) | NO | YES | NO | NO |
| Sidebar apps | Basic | YES | NO | YES | YES | YES |
| Battery saver | NO | NO | NO | NO | YES | YES |
| Custom hotkeys | NO | Basic | NO | YES | Basic | NO |
| RSS feeds | NO | NO | YES | YES | NO | NO |
| Whiteboard/canvas | NO | YES (Easel) | NO | NO | NO | NO |

*Arc uses uBlock Origin on the backend.

---

## WHAT POWER USERS CONSISTENTLY COMPLAIN ABOUT

Sourced from Reddit, forums, and tech publications:

1. **"Why can't Chrome block ads natively?"** -- Every other browser does this. Chrome's conflict of interest (Google = ad company) means this will NEVER happen.
2. **"Tabs are unmanageable after 20+"** -- Horizontal tabs don't scale. Vertical tabs arrived in 2026 but are bare-bones.
3. **"Chrome eats my RAM"** -- Multi-process architecture with no smart suspension.
4. **"I need 10 extensions for basic functionality"** -- Extensions conflict, slow browser, and are security risks. Average user has 8-12.
5. **"Manifest V3 killed my ad blocker"** -- uBlock Origin is dead on Chrome. Users feel betrayed.
6. **"No native screenshot tool"** -- Edge, Vivaldi, Opera all have this.
7. **"No reader mode"** -- Chrome removed the experimental reader mode flag.
8. **"No session save/restore"** -- Crash = lost tabs. Other browsers save sessions natively.
9. **"New tab page is useless"** -- Momentum has 3M+ users just to replace the new tab page.
10. **"UI clutter from features nobody asked for"** -- Shopping insights, visual search overlays added while basics are missing.

---

## FEATURES CHROME HAS BEEN SLOW TO ADD (YEARS OF REQUESTS)

| Feature | Years Requested | Status |
|---------|----------------|--------|
| Vertical tabs | 5+ years | Added Jan 2026 (basic) |
| Tab groups | 4+ years | Added 2020 (basic) |
| Split screen | 3+ years | Added 2025 (basic) |
| Built-in ad blocker | 10+ years | NEVER (conflict of interest) |
| Dark mode for web content | 5+ years | NEVER |
| Reader mode | 4+ years | Removed experimental flag |
| Session save/restore | 10+ years | NEVER |
| Screenshot tool | 5+ years | NEVER |
| Sidebar | 3+ years | Basic (2024) |
| Tab suspension/sleeping | 5+ years | Basic (auto-discard, unreliable) |

---

## BETTER BROWSER -- PROPOSED MODULE MAP

Based on this research, here's a potential product architecture:

### Module 1: SHIELD (Privacy & Blocking)
Replaces: uBlock Origin Lite, Privacy Badger, ClearURLs, Cookie AutoDelete, Ghostery
- Ad blocking (MV3-optimized)
- Tracker blocking
- Fingerprint randomization
- URL cleaning (strip tracking params)
- Cookie auto-management
- **Estimated addressable users: 50M+**

### Module 2: COMMAND (Tab & Workspace Management)
Replaces: OneTab, Session Buddy, Tab Wrangler, Workona, The Great Suspender
- Workspaces/Spaces (a la Arc)
- Smart tab suspension with memory dashboard
- Session save/restore with cloud sync
- Enhanced tab search
- Tab grouping with visual indicators
- **Estimated addressable users: 10M+**

### Module 3: STUDIO (Productivity)
Replaces: Awesome Screenshot, GoFullPage, Momentum, Pocket, Evernote Clipper
- Screenshot + annotation
- Built-in notepad (sidebar)
- Read later / reading list
- Custom new tab dashboard
- Quick canvas/whiteboard (a la Arc Easel)
- **Estimated addressable users: 15M+**

### Module 4: LENS (Content Enhancement)
Replaces: Dark Reader, Mercury Reader, Stylus, Video Speed Controller
- Universal dark mode
- Reader mode
- Page customization (CSS/layout, a la Arc Boosts)
- Video controls
- RSS feed support
- **Estimated addressable users: 10M+**

### Module 5: FLOW (Performance)
Replaces: Auto Tab Discard, Tab Suspender, performance monitoring extensions
- Per-tab resource dashboard
- Smart auto-hibernation rules
- Battery saver mode
- Background process control
- **Estimated addressable users: 5M+**

---

## KEY STRATEGIC INSIGHTS

1. **Manifest V3 created a once-in-a-decade opportunity.** Millions of users lost their ad blocker. They're angry and looking for alternatives. A well-designed MV3-native privacy suite could capture massive share.

2. **The "extension fatigue" problem is real.** Users install 8-12 extensions, actively use 2-3, and the rest are security liabilities consuming resources. A unified suite with a single settings panel is the answer.

3. **Arc proved the UX thesis but failed on platform.** Arc's innovations (Spaces, Boosts, Easel) were beloved but Mac-only and the company was acquired by Atlassian. Bringing Arc-like features to Chrome via extension reaches 3.5B+ users.

4. **Chrome will NEVER add ad blocking.** Google's ad revenue ($238B in 2023) makes this a permanent conflict of interest. This gap is structural and permanent.

5. **The "task-centric browsing" trend is accelerating.** Experts predict tab-based interfaces will give way to project-driven organization. 92% of consumers demand more personalization. Browsers that fail to reduce cognitive load will lose users.

6. **Security is a selling point.** Extensions are attack vectors (The Great Suspender became malware). A single trusted suite from a single developer reduces attack surface vs. 10 extensions from 10 developers.

---

## Sources

- [Chrome Features You Need to Try in 2025](https://mycomputerworks.com/the-best-chrome-features-you-need-to-try-in-2025/)
- [What New Features Does Chrome 2026 Bring?](https://www.aboutchromebooks.com/what-new-features-does-chrome-2026-bring/)
- [The Great Browser Battle 2026](https://medium.com/@hi_one_music/the-great-browser-battle-2026-how-i-stopped-worrying-and-learned-to-love-one-particular-app-c8f20bef31a3)
- [5 Useful Google Chrome Features You Should Be Using In 2026](https://www.bgr.com/2096414/useful-google-chrome-features/)
- [Why You Should Avoid Most Chrome Extensions](https://jeremyrouet.medium.com/why-you-should-avoid-most-chrome-extensions-a76465ba57e6)
- [3 Reasons Why You Shouldn't Install Lots Of Browser Extensions](https://www.makeuseof.com/tag/3-reasons-install-lots-browser-extensions-opinion/)
- [Chrome Extension Statistics: Data From 2024](https://www.debugbear.com/blog/chrome-extension-statistics)
- [Counting Chrome Extensions - Chrome Web Store Statistics](https://www.debugbear.com/blog/counting-chrome-extensions)
- [Arc Browser vs Brave Comparison](https://efficient.app/compare/arc-browser-vs-brave)
- [AI Browser Comparison: Arc vs Brave vs AI-Enhanced Chrome 2025](https://www.theaiservicescompany.com/blog/ai-browser-arc-vs-brave-vs-ai-enhanced-chrome)
- [Arc Browser vs Google Chrome](https://efficient.app/compare/arc-browser-vs-chrome)
- [5 Arc Browser Features Chrome Needs to Steal](https://www.xda-developers.com/arc-browser-features-google-chrome-needs-to-steal-to-win-me-back-over/)
- [10 Vivaldi Features That Google Chrome Doesn't Have](https://www.makeuseof.com/vivaldi-features-beat-chrome/)
- [It's Time To Ditch Chrome And Start Using Vivaldi](https://www.slashgear.com/1624952/vivaldi-web-browser-why-to-switch-from-chrome/)
- [Vivaldi vs Chrome 2026](https://www.lookkle.com/vivaldi-vs-chrome)
- [10 Innovative Opera Features That Lured Me Away from Chrome](https://www.pcworld.com/article/798153/10-innovative-opera-features-that-lured-me-away-from-chrome.html)
- [7 Features in Opera I Wish I Had on Chrome](https://www.makeuseof.com/features-in-opera-browser-wish-i-had-on-chrome/)
- [9 Opera Features Chrome Should Introduce](https://www.xda-developers.com/opera-features-chrome-should-introduce/)
- [7 Features I Want Chrome to Steal from Its Rivals](https://www.androidauthority.com/chrome-missing-features-3583167/)
- [Why Chrome is Still My Default in 2025](https://www.howtogeek.com/why-chrome-is-still-my-default-in-2025-and-the-settings-that-fix-its-biggest-annoyances/)
- [Brave Shields - Privacy Protection](https://brave.com/shields/)
- [Brave Privacy Features](https://brave.com/privacy-features/)
- [Brave Fingerprinting Protections](https://github.com/brave/brave-browser/wiki/Fingerprinting-Protections)
- [Manifest V3 Ad Blocker Impact](https://adblock-tester.com/ad-blockers/manifest-v3-ad-blocker-impact/)
- [Why uBlock Origin Was Removed from Chrome](https://getblockify.com/blog/why-ublock-origin-was-removed-from-chrome/)
- [MV3 Privacy vs Profit Study (PoPETs 2026)](https://arxiv.org/html/2503.01000)
- [7 Bold Predictions for Browsers in 2026](https://shift.com/blog/how-are-browsers-going-to-change-in-2026-from-the-ceo-of-a-browser-company/)
- [Which Browser to Use in 2026](https://dev.to/mil10akash/which-browser-to-use-in-2026-my-messy-notes-m51)
- [Microsoft Edge Vertical Tabs](https://www.microsoft.com/en-us/edge/features/vertical-tabs)
- [Edge Vertical Tabs Redesign](https://www.windowslatest.com/2025/04/14/microsoft-edges-redesigned-vertical-tabs-makes-browsing-fun-again-on-windows-11/)
- [Arc Browser Spaces](https://resources.arc.net/hc/en-us/articles/19228064149143-Spaces-Distinct-Browsing-Areas)
- [Session Buddy](https://chromewebstore.google.com/detail/session-buddy-tab-bookmar/edacconmaakjimmfgnblocblbcdcpbko)
- [Best Tab Manager Extensions for Chrome](https://www.partizion.io/blog/best-chrome-session-manager-extensions)
- [Unused Chrome Extension Statistics 2026](https://www.aboutchromebooks.com/unused-chrome-extension-statistics-2026/)
- [Opera vs Chrome Comparison](https://www.opera.com/opera/compare/chrome)
