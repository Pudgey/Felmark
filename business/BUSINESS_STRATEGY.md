# [Name TBD] — Business Strategy

> **Created**: 2026-03-29
> **Updated**: 2026-03-29
> **Status**: Approved — MVP Scoping Next
> **Product**: A micro-SaaS for freelancers. Starts as a browser notepad + workspace. Expands into the freelancer operating system.
> **Identity**: NOT a note-taking app. A freelancer tool that happens to start with notes.
> **Entity**: Micro-SaaS holding company (structure for portfolio, execute with single focus)

---

## Business Structure

### The Framework: Holding Company + Single Focus

```
[Holding Company LLC]
    ├── Hometress (marketplace app — in progress)
    └── [Product] (chrome extension — starting now)
    └── [Future Product #3] (after $5-10K MRR on [Product])
    └── [Future Product #4] (from expired extensions dataset)
```

**Structure as a holding company from day 1.** Execute as single focus.

- Clean separation of finances, liabilities, IP per product
- Each product gets its own Stripe account, domain, brand
- If you sell one product later, the structure is already clean
- Tax advantages of running multiple products under one entity
- Looks professional to acquirers

**But only build ONE new product at a time.** Hometress + [Product] = two products. That's the max while both need active development.

### Decision Gate

After [Product] hits **$5-10K MRR** (estimated 6-9 months), evaluate:

| Option | When To Choose |
|--------|---------------|
| **Go deeper** — add workspaces, time tracking, invoicing | [Product] users are asking for it; freelancer signal is strong |
| **Go wider** — launch product #2 from expired extensions dataset | [Product] is stable and doesn't need daily attention |
| **Both** — hire someone to maintain [Product], start next product | Revenue funds the hire ($5K MRR covers a part-time contractor) |

The expired extensions dataset (9,600+ opportunities) isn't going anywhere. Focus now, expand later.

---

## Product Identity

### What We Are NOT

We are NOT a note-taking app. The note-taking market is saturated:
- Notion: 100M users, $600M ARR, $11B valuation
- Obsidian: 1.5M MAU, $25M ARR, zero VC
- Evernote: 225M users (declining but massive)
- Google Keep: free, 8M Chrome extension users
- Plus: Bear, Craft, Roam, Logseq, Supernotes, Heptabase, Reflect, Mem, Capacities, Tana, Amplenote, Simplenote, Standard Notes, Joplin, UpNote...

Going head-to-head on "note-taking" is suicide. We don't compete with any of these.

### What We ARE

A **micro-SaaS for freelancers** that lives in the browser.

Notes are the **entry point** — the hook that captures users. The product is a **freelancer operating system** that grows with them:

```
ENTRY           EXPAND               PLATFORM
─────           ──────               ────────
Notepad    →    Client workspaces    →    Time tracking
                                          Invoicing
                                          Messaging
                                          Client portal
                                          Analytics
```

### Competitive Position

We don't compete with note apps. We sit in a gap nobody owns:

```
Google Keep ────── Simple, free, dead-end (can't grow)
     ↓
[OUR PRODUCT] ──── Simple start, grows with you, browser-native, freelancer-focused
     ↓
Notion ─────────── Powerful, complex, separate app, teams-focused
     ↓
HoneyBook ──────── Full business suite ($19-79/mo), overkill
```

| vs. Note Apps | vs. Freelancer Suites |
|---|---|
| We don't compete on features (graphs, databases, backlinks) | We don't compete on breadth (CRM, proposals, contracts) |
| We compete on **context** — we know which client you're working on | We compete on **simplicity** — lightweight, browser-native, $6-12/mo |
| Notion doesn't know your current tab. We do. | HoneyBook is overkill for 80% of freelancers. We're "just enough." |

### The Key Insight

The note-taking market's biggest gap is NOT a feature gap. It's a **context gap**:
- 35% of users abandon note apps within 6 months
- #1 reason people leave Notion: "too complex, I spend more time organizing than working"
- Google Keep captures fast but can't grow into anything
- No tool does both: **instant capture AND graceful expansion into structured work**
- No serious tool lives WHERE you already are — the browser
- No tool knows which CLIENT you're working on right now

We fill all five gaps by being browser-native, client-aware, and progressively complex.

---

## Entry Point: The Notepad

### Why Start Here

The notepad is the Trojan horse. It gets us distribution.

**The incumbent is broken**: Notepad extension — 200K users, 3.8 stars, reviews full of data loss complaints, no dark mode, no organization, barely maintained.

**The audience is proven**: 200K users on a broken product + 8M Google Keep extension users who've outgrown it.

**The build is small**: 2-4 weeks to MVP. Ship fast, capture users, then expand.

### The Incumbent's Weaknesses (Notepad — 200K users, 3.8 stars)

From actual user reviews:

| Complaint | Our Answer |
|-----------|-----------|
| Notes disappear when switching tabs | chrome.storage.local + sync — data never lost |
| Notes randomly don't save | Autosave on every keystroke with debounce + visual "Saved" indicator |
| No dark mode | Light / dark / system auto from day one |
| Can't reorder notes | Drag-and-drop reordering |
| Can't right-click paste | Full clipboard support |
| Can't resize the panel | Resizable Side Panel |
| Can't group notes | Folders / categories / client workspaces |
| No save button / unclear autosave | Visible save state always shown |
| Extension broke after MV3 update | MV3-native from the ground up |
| "Willing to pay to keep it" | Pro tier |

### Development Approach

**AI-coded, not outsourced.** Built with Claude, Cursor, and AI tooling. No traditional dev team, no agency, no outsourcing. This compresses every timeline by 3-5x compared to conventional development.

### Google Risk Assessment

**Real but manageable.** Google kills extensions that:
- Block ads (conflicts with their revenue)
- Request excessive permissions without justification
- Go unmaintained (MV2 sunset proved this)
- Violate content policies

We do none of these. A well-maintained productivity/workspace extension is in Google's interest — it makes Chrome more useful. Keep it updated, follow policies, respond to reviews, and the risk is low. The web app provides Chrome-independence regardless.

### Feature Roadmap (AI-Coded Timeline)

#### Phase 1: MVP — Notepad + Workspaces (Weeks 1-3)

The product is **notepad + client workspaces from day one.** Not a notepad that adds workspaces later. The workspace IS the product. The notepad is one feature inside it.

| Feature | Detail |
|---------|--------|
| **Client workspaces** | Create workspaces per client/project. Switch workspace, switch context. |
| **Notes per workspace** | Rich text notes tied to each client. Never lose data. |
| **Autosave** | Save on every keystroke (debounced). Visual "Saved" indicator. |
| **Dark mode** | Light / dark / system auto |
| **Drag-and-drop** | Reorder notes, move between workspaces |
| **Side Panel UI** | Persistent, resizable via chrome.sidePanel API |
| **Full clipboard** | Right-click paste, cut, copy all work |
| **Search** | Fuzzy search across all workspaces and notes |
| **Pin notes** | Keep important notes at top per workspace |
| **Rich text + Markdown** | Bold, italic, bullets, checklists, code blocks |
| **Export** | Markdown, plain text, JSON |
| **Page-linked notes** | Notes auto-tied to the URL you're on |

**Goal**: Ship to Chrome Web Store. Capture Notepad's frustrated 200K users.

**Launch**: Chrome Web Store, ProductHunt, r/chrome, r/freelance, r/productivity, Hacker News

#### Phase 2: Pro Tier + Time Tracking (Weeks 4-8)

| Feature | Detail |
|---------|--------|
| **Cloud sync** | Workspaces + notes synced across all devices |
| **Auto time tracking** | Detect client by domain mapping, log hours automatically |
| **Hours dashboard** | Hours vs. budget per client, daily/weekly/monthly |
| **Web clipper** | Highlight text on any page → save to workspace notes |
| **Templates** | Meeting notes, project brief, client onboarding |
| **Reminders** | Browser notifications on notes |
| **Export to PDF** | Professional export for sharing |

**Price**: Pro $8/mo or $64/yr

**Goal**: First paying users. Target $2-5K MRR by week 8.

#### Phase 3: Invoicing + Client Portal (Months 3-5)

| Feature | Detail |
|---------|--------|
| **One-click invoice** | Generate from tracked hours per client |
| **Stripe Connect** | Clients pay in-app, funds to freelancer's bank |
| **Client portal** | Clients see shared docs, approve hours, view/pay invoices |
| **Shared workspaces** | Invite client or collaborator to a workspace |
| **Comments** | Discuss within notes |
| **Activity feed** | See what was added/changed |

**Goal**: Full freelancer workflow in one tool. Target $10-20K MRR.

#### Phase 4: Web App + Analytics (Months 4-6)

| Feature | Detail |
|---------|--------|
| **Web dashboard** | Full workspace management, not just side panel |
| **Revenue analytics** | Income by client, monthly trends, profitability |
| **Tax prep reports** | Annual income summary by client for tax season |
| **Client profitability** | "Client A = $85/hr effective, Client B = $42/hr effective" |
| **Mobile-responsive** | Access from phone via web app |

**Goal**: Product transcends the extension. Target $20-40K MRR.

#### Phase 5: Messaging + Teams (Months 6-8)

| Feature | Detail |
|---------|--------|
| **Async messaging** | Per-workspace chat with clients and collaborators |
| **Team workspaces** | Multiple team members in same client workspace |
| **Real-time collab** | Multiple people editing same note |
| **Admin controls** | Manage team permissions, billing |

**Price**: Team $6/user/mo

**Goal**: Platform with network effects. Target $50-100K MRR.

#### Phase 6: Platform (Months 8-12)

| Feature | Detail |
|---------|--------|
| **API** | Let other tools integrate |
| **Template marketplace** | Community workspace templates |
| **Integrations** | Figma, Notion, Google Drive, Asana per workspace |
| **Mobile app** | Native companion app |
| **Context Engine AI** | Smart suggestions based on browsing + work patterns |

**Goal**: Ecosystem. $100K+ MRR.

---

## Business Model

### Pricing

| Tier | Price | What You Get |
|------|-------|-------------|
| **Free** | $0 | 3 workspaces, notepad, dark mode, search, rich text, export. Local storage. |
| **Pro** | $8/mo or $64/yr | Unlimited workspaces, cloud sync, time tracking, invoicing, templates, web clipper |
| **Team** | $6/user/mo | Shared workspaces, messaging, real-time collab, client portal, admin controls |

### Why $8/mo

[Product] replaces tools freelancers already pay for:

| Tool | Cost | What [Product] Replaces |
|------|------|---------------------------|
| Notion | $10/mo | Notes, docs, organization |
| Toggl Track | $10-13/mo | Time tracking + reports |
| Workona | $5-7/mo | Workspace management |
| FreshBooks (starter) | $19/mo | Invoicing |
| Pocket | $5/mo | Web clipping |
| **Total replaced** | **$49-54/mo** | **[Product] Pro: $8/mo** |

### Revenue Trajectory (AI-Coded Timeline)

| Milestone | Free Users | Paying | MRR | ARR |
|-----------|-----------|--------|-----|-----|
| Week 4 (launch) | 2K | 0 | $0 | — |
| Month 2 | 10K | 200 | $1.6K | $19K |
| Month 4 | 30K | 1.2K | $9.6K | $115K |
| Month 6 | 75K | 3K | $24K | $288K |
| Month 9 | 150K | 6K | $48K | $576K |
| Month 12 | 300K | 12K | $96K | $1.15M |

### Revenue Streams

| Stream | When | How |
|--------|------|-----|
| Pro subscriptions | Month 2+ | $8/mo per user |
| Team subscriptions | Month 6+ | $6/user/mo |
| Stripe Connect fees | Month 3+ | Small % on invoice payments |
| Template marketplace | Month 8+ | Premium templates, take commission |
| API access | Month 10+ | Let other tools integrate with [Product] |

---

## Market

### Target Users

**Primary (from day one):**
- Freelancers managing 3-10 clients
- Solopreneurs running service businesses
- Small agency owners (2-5 person shops)
- Virtual assistants managing multiple clients
- Consultants juggling engagements

**Secondary (captured by the notepad hook):**
- Anyone who needs a browser notepad (200K+ existing Notepad users)
- Students, researchers, writers, developers
- Power users who want organized browser workspaces

The product is BUILT for freelancers. Others benefit from it, but freelancers are the core audience from day one.

### Market Size

| Segment | Size |
|---------|------|
| Chrome users (total) | 3.5 billion |
| Users who install productivity extensions | ~55% of extension installs |
| Notepad's existing user base | 200K (and frustrated) |
| US freelancers | 73.3 million |
| Global freelancers | 1.57 billion |
| Freelance platform market | $9.19B (2024) → $16.5B (2030) |

### Competitive Landscape

#### Browser Extensions (Direct Competitors)

| Competitor | Users | Stars | Price | Our Advantage |
|-----------|-------|-------|-------|---------------|
| **Notepad** | 200K | 3.8 | Free | Broken — notes disappear, no dark mode, no organization |
| **WorkTab** | 22 | 5.0 | Freemium | Tab manager, not a notepad. Different product. |
| **Google Keep Extension** | 8M+ | N/A | Free | Dead-end — can't grow into anything. No workspaces, no long-form. |
| **Notion Web Clipper** | 3M+ | N/A | $10/mo | Clips TO Notion — requires subscription. We ARE the app. |
| **OneNote Web Clipper** | 2M+ | N/A | Free | Clips TO OneNote — requires Microsoft ecosystem. |

#### Note-Taking Apps (Indirect — We Don't Compete Here)

| App | Users | ARR | Price | Why We're Different |
|-----|-------|-----|-------|-------------------|
| **Notion** | 100M | $600M | $10/mo | Too complex. #1 churn reason: "I organize more than I work." We're simple. |
| **Obsidian** | 1.5M MAU | $25M | Free + $4/mo sync | Local-first, power users. No browser extension. No freelancer features. |
| **Evernote** | 225M | $18M (declining) | $15/mo | Legacy. Gutted free tier. Users leaving. |
| **Supernotes** | Small | Unknown | $8.25/mo | Card-based PKM. Niche. Not browser-native. Not freelancer-focused. |
| **Heptabase** | 350K | $7M | $9/mo | Visual/spatial PKM. Research tool. Not quick capture. |
| **Capacities** | Small | Unknown | $8/mo | Closest to our vibe — but not browser-native, no time tracking. |
| **Simplenote** | Unknown | $0 | Free | Plain text only. No organization. No growth path. |

#### Freelancer Suites (Future Competitors — We Grow Into This)

| App | Price | Why We Win |
|-----|-------|-----------|
| **HoneyBook** | $19-79/mo | Overkill CRM. Not browser-native. Expensive. |
| **Bonsai** | $21-52/mo | Full suite. Too heavy for most freelancers. |
| **Moxie** | $24-75/mo | Same — wrong weight class. |
| **Toggl Track** | $10-13/mo | Time tracking only. No notes, no workspaces, no invoicing. |

**The gap**: No browser-native tool that (a) captures notes instantly, (b) organizes by client/project, (c) tracks time, (d) handles invoicing, and (e) costs under $12/mo. The note apps are too generic. The freelancer suites are too heavy. We're the middle.

#### Key Market Stats

| Stat | Number |
|------|--------|
| Note-taking app market | $1.2B (2026) → $5-7B (2034) |
| Users who abandon note apps within 6 months | 35% |
| Users who switched primary app in last 2 years | 48% |
| Import/export failure rate across apps | 18% |
| Note app CAGR | 16-22% |

---

## Go-To-Market

### Launch (Weeks 1-4)

| Channel | Action | Expected Users |
|---------|--------|---------------|
| Chrome Web Store | SEO-optimized listing targeting "notepad", "freelancer tools", "workspace manager" | 2-5K organic |
| ProductHunt | Launch day — "The browser workspace freelancers have been waiting for" | 2-5K spike |
| Reddit | r/freelance, r/webdev, r/graphic_design, r/chrome, r/SideProject | 1-3K |
| Hacker News | "Show HN: Browser workspaces for freelancers — notes, time tracking, invoicing" | 2-5K spike |
| Twitter/X | Build in public from week 1 | 500-1K |
| Freelancer communities | Upwork forums, Fiverr forums, freelance Slack/Discord groups | 500-1K |

### Ongoing Growth

| Channel | Strategy |
|---------|----------|
| Chrome Web Store SEO | Keywords: "freelancer tools", "client workspace", "browser notepad", "time tracker" |
| Content/SEO | Blog: "how to organize clients as a freelancer", "best time tracking for freelancers" |
| Two-sided growth | Every client invitation = new user acquisition (the network effect) |
| Word of mouth | Free tier is genuinely useful → organic sharing |
| Review response | Respond to every review, fix issues fast, build trust |
| Notepad migration | Import from Notepad's bookmark-based storage format (steal their 200K users) |
| Freelancer newsletters | Sponsor/feature in freelance-focused newsletters |

### Key Messaging

**Primary**: "Your clients. Your notes. Your time. One browser workspace."

**For Chrome Web Store**: "The workspace freelancers use to organize clients, track time, and get paid — right in your browser."

**For note-takers**: "A notepad that actually works. Organize by client. Never lose a note."

**For Toggl/Clockify users**: "Time tracking that starts automatically when you're on a client's site."

---

## Technical Stack

### Chrome Extension (MV3)

```
[product]/
├── manifest.json (MV3)
├── service-worker.js
│   ├── workspace-manager.js (workspace state, switching)
│   ├── storage-manager.js (autosave, redundant backup)
│   ├── time-tracker.js (domain detection, auto-logging)
│   └── sync-engine.js (cloud sync for Pro)
├── side-panel/
│   ├── app.html (main UI — workspaces + notes + time)
│   └── invoice.html (invoice generation view)
├── content-scripts/
│   ├── domain-detector.js (which client's site you're on)
│   ├── web-clipper.js (highlight → save to workspace)
│   └── page-linker.js (auto-detect current URL for notes)
├── popup/
│   └── quick-switch.html (fast workspace toggle + quick note)
└── assets/
    ├── themes/ (light, dark)
    └── icons/
```

### Key APIs

| API | Purpose |
|-----|---------|
| chrome.sidePanel | Persistent workspace UI (notes, time, messages) |
| chrome.storage.local | Local workspace + note storage (never loses data) |
| chrome.storage.sync | Cross-device sync (Pro) |
| chrome.alarms | Periodic time tracking checkpoints + backup |
| chrome.tabs | Workspace switching, domain detection, page-linked notes |
| chrome.tabGroups | Visual tab grouping per workspace |
| chrome.contextMenus | Right-click "Save to [Workspace]" |

### Web App (Month 4+)

| Component | Technology |
|-----------|-----------|
| Frontend | React / Next.js |
| Backend | Node.js or serverless (Cloudflare Workers) |
| Database | Supabase (PostgreSQL + Realtime + Auth in one) |
| Real-time | Supabase Realtime (messaging, collab) |
| Auth | Google OAuth + email (via Supabase Auth) |
| Payments | Stripe (subscriptions) |
| Invoicing | Stripe Connect (reuse Hometress code) |
| Hosting | Vercel |
| File storage | Supabase Storage or Cloudflare R2 |

---

## Hometress Synergy

| Shared Asset | How It Helps [Product] |
|-------------|--------------------------|
| Stripe Connect expertise | Reuse for freelancer invoicing (Phase 4) |
| React Native / TypeScript skills | Same language for web app |
| Marketplace understanding | Two-sided dynamics (freelancer + client portal) |
| Freelancer audience | Hometress cleaners ARE potential [Product] users |
| Design system (Engine) | Potentially share UI components for web app |

[Product] is not a distraction from Hometress. It's a **parallel bet** on the same user archetype (independent service providers) with a different entry point (browser tool vs. marketplace app). Revenue from [Product] can fund Hometress development.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Notepad fixes their issues | Low | High | They haven't in 10+ years. Bookmark-based architecture is fundamentally limited. |
| Google builds native workspaces | Low | Medium | Google won't build a freelancer tool. Even if they add basic workspaces, our client-specific features differentiate. |
| Chrome Web Store policy change | Low | Medium | We're a productivity tool, not an ad blocker. Keep it updated, follow policies. Web app provides Chrome-independence. |
| Low conversion to Pro | Medium | Medium | Free tier = 3 workspaces (enough to feel the value). Pro = sync + time tracking + invoicing (clear upgrade). |
| Can't reach freelancers | Medium | Medium | Chrome Web Store SEO + r/freelance + build in public + client invitations as growth loop. |
| Note-taking apps add browser extensions | Low-Med | Low | They'd be adding a feature. We ARE the product. Context-awareness is our moat. |
| Split focus with Hometress | Medium | Medium | MVP is 2-3 weeks. AI-coded. Hometress continues in parallel. Same user archetype. |

---

## Timeline (AI-Coded)

| Phase | Timeline | What Ships | Revenue Target |
|-------|----------|-----------|---------------|
| **MVP** | Weeks 1-3 | Notepad + workspaces + dark mode + autosave + page-linked notes | $0 (free launch) |
| **Pro + Time Tracking** | Weeks 4-8 | Cloud sync, auto time tracking, hours dashboard, templates | $2-5K MRR |
| **Invoicing** | Months 3-5 | Stripe Connect invoicing, client portal, shared workspaces | $10-20K MRR |
| **Web App** | Months 4-6 | Dashboard, analytics, revenue reports, tax prep | $20-40K MRR |
| **Messaging + Teams** | Months 6-8 | Async chat, team workspaces, real-time collab | $50-100K MRR |
| **Platform** | Months 8-12 | API, integrations, templates marketplace, mobile, Context Engine AI | $100K+ MRR |

**Decision gate at month 4**: Evaluate — go deeper on this product OR launch product #2 from expired extensions dataset. Revenue from [Product] funds the decision.

---

## Success Metrics

| Metric | Month 2 | Month 4 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| Free users | 5K | 30K | 75K | 300K |
| Pro subscribers | 100 | 1.2K | 3K | 12K |
| MRR | $800 | $9.6K | $24K | $96K |
| Chrome Web Store rating | 4.5+ | 4.5+ | 4.7+ | 4.7+ |
| Churn rate | <8%/mo | <5%/mo | <4%/mo | <3%/mo |
| Client invitations sent | — | 500 | 2K | 10K |

---

## Strategic Moats

### 1. The Client Graph
Every day of use adds client relationship data (notes, hours, invoices, messages). By month 6, switching means losing your entire client history. This data can't move to Notion.

### 2. Two-Sided Network
Every client invitation is a distribution event. Freelancer invites client → client discovers product → client uses it with THEIR freelancers → cycle repeats. Same flywheel as Hometress.

### 3. The Context Engine
The extension knows what tab you're on, which client's tools you're using, and how long you've been working. No standalone app has this data. Over time, AI uses this to surface insights: "You haven't invoiced Client B in 45 days."

### 4. Web App Independence
The extension captures data. The web app makes it valuable. If Chrome changes anything, the web app survives with all user data intact.

### 5. Content + Community
Own the freelancer conversation through SEO content, rate calculators, templates, and community. When someone Googles "how to invoice a client," your blog shows up.

---

## The Bottom Line

[Product] is a micro-SaaS for freelancers, not a note-taking app.

1. **Notepad + workspaces from day one** — not a notepad that adds workspaces later
2. **AI-coded** — full product in months, not years. Time tracking and invoicing in year 1, not year 5.
3. **Google risk is low** — productivity tool, not ad blocker. Web app provides independence regardless.
4. **Five moats** — client graph, two-sided network, context engine, web app, content/community
5. **Hometress synergy** — same user archetype, same Stripe Connect code, same two-sided dynamics
6. **Holding company ready** — structured to add products from the expired extensions dataset after $10K MRR

**Next step**: Scope the MVP and start building.
