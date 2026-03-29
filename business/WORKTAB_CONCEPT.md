# WorkTab — Concept Document

> **Created**: 2026-03-28
> **Status**: Concept Approved — MVP Planning Next
> **One-liner**: A mini-Slack for freelancers and business owners that lives in the browser. Switch clients, switch everything.

---

## The Problem

Freelancers, solopreneurs, and small agency owners manage 3-10 clients simultaneously. Each client has its own tools — Google Docs, Figma, Notion, Linear, Asana, Canva, Stripe, email threads. Everything is mixed together in one browser window — 40 tabs, no separation.

Communication is fragmented: Slack for one client, email for another, iMessage for a third. Time tracking is manual or forgotten. Switching between clients means mentally rebuilding context every time.

**Slack doesn't solve this.** Slack is for employees inside one company. Freelancers work *across* companies. They need workspaces per client, not per employer.

**HoneyBook/Bonsai/Moxie are overkill.** Full business suites at $20-75/mo that live in their own web apps. Too heavy, too expensive, wrong context. Most freelancers don't need a CRM.

---

## The User

- Freelance designers, developers, writers, marketers
- Solopreneurs running service businesses
- Small agency owners (2-5 person shops)
- Virtual assistants managing multiple clients
- Independent cleaning professionals (Hometress crossover)
- Consultants juggling multiple engagements

**Common traits:**
- Live in Chrome all day
- Manage 3-10 clients simultaneously
- Use 5-10 different SaaS tools across clients
- Communication is fragmented across platforms
- Time tracking is inconsistent or nonexistent
- Context-switching is their biggest productivity killer

---

## The Product

### Core Concept

WorkTab turns your browser into a client-organized workspace. Each client gets an isolated workspace with its own tabs, notes, messages, and time tracking. Switch client → everything switches. Zero context-switching cost.

```
┌──────────────────────────────────────────────────┐
│  WorkTab                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ Client A │ │ Client B │ │ Client C │  [+ New] │
│  │  ● 3msg  │ │   1msg   │ │          │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│                                                   │
│  ┌─ Side Panel ─────────────────────────┐        │
│  │                                       │        │
│  │  Messages (3 unread)                 │        │
│  │  Shared Links & Docs                │        │
│  │  Notes                               │        │
│  │  Time: 2h 14m today                 │        │
│  │  This week: 11.5h / 15h budget      │        │
│  │                                       │        │
│  └───────────────────────────────────────┘        │
└──────────────────────────────────────────────────┘
```

### What It Is

- A browser-native workspace manager organized by client
- Lightweight async messaging per workspace
- Auto time tracking based on which client's domains you're on
- Notes, shared links, and docs tied to each client context
- Hours tracking with budget visibility and invoicing

### What It Is NOT

- Not a project management tool (Asana/Linear own that)
- Not a full Slack replacement (no channels, threads, integrations ecosystem)
- Not a CRM (no pipelines, deals, automation)
- Not a full business suite (HoneyBook/Bonsai territory)

It's the **connective tissue** between all the tools a freelancer already uses. The browser is the workspace. WorkTab organizes it by client.

---

## Feature Set

### Core Features (MVP — Phase 1)

| Feature | What It Does | Replaces |
|---------|-------------|----------|
| **Client workspaces** | Each client = isolated workspace with its own tabs, pins, bookmarks. Switch client, switch tabs. | OneTab, Workona, Session Buddy |
| **Notes per workspace** | Quick notes tied to each client — meeting notes, to-dos, feedback | Notion (partial), sticky notes |
| **Auto time tracking** | Detects when you're on Client A's domains, logs time automatically. Domain-to-client mapping. | Toggl, Clockify, manual timers |
| **Hours dashboard** | Hours logged vs. budget per client, daily/weekly/monthly rollup | Spreadsheets, Toggl reports |

### Phase 2 Features

| Feature | What It Does | Replaces |
|---------|-------------|----------|
| **In-browser messaging** | Async chat per workspace. Invite clients or collaborators. | Slack (partial), email threads |
| **Shared links & docs** | Pin important URLs, docs, credentials per client | Bookmarks, shared Google Docs |
| **Web app dashboard** | Full time reports, workspace management, settings | Toggl dashboard |
| **Cloud sync** | Workspaces, notes, time logs synced across devices | Manual backup |

### Phase 3 Features

| Feature | What It Does | Replaces |
|---------|-------------|----------|
| **One-click invoice** | Generate invoice from tracked hours, send to client | FreshBooks, Wave, manual invoicing |
| **Client portal** | Clients see shared docs, approve hours, view/pay invoices | Email back-and-forth |
| **Stripe Connect payments** | Clients pay invoices in-app, funds to freelancer's bank | PayPal invoices, Venmo |
| **Team workspaces** | Multiple team members in the same client workspace | Slack channels |

### Phase 4 Features (Platform)

| Feature | What It Does |
|---------|-------------|
| **Workspace templates** | Pre-built setups for designer, developer, writer, marketer |
| **Integrations** | Connect Figma, Notion, Asana, Google Drive per workspace |
| **Community** | Freelancers share workspace setups and templates |
| **Analytics** | Profitability per client, utilization rate, trend reports |

---

## Why Google Won't Kill This

| Risk Factor | Assessment |
|-------------|-----------|
| Competes with Chrome features? | No — Google won't build "freelancer workspace manager" |
| Ad blocking? | No — zero ad-related features |
| Broad permissions? | Minimal — tab management + side panel + storage |
| Collaboration tool? | Yes — Google integrates with these, doesn't kill them |
| Extension IS the product? | No — extension is the interface, web app is the product |

Google builds horizontal tools for billions. They will never build a vertical product for freelancers managing multiple clients. WorkTab is in a lane they don't care about.

---

## Business Model

### Pricing

| Tier | Price | What You Get |
|------|-------|-------------|
| **Free** | $0 | 3 client workspaces, local only, basic time tracking |
| **Pro** | $12/mo or $96/yr | Unlimited workspaces, cloud sync, messaging, invoicing, time reports |
| **Team** | $8/user/mo | Shared workspaces, team time tracking, client portals, admin controls |

### Why $12/mo Works

WorkTab replaces tools freelancers already pay for:

| Tool | Cost | What WorkTab Replaces |
|------|------|----------------------|
| Toggl Track | $10-13/mo | Auto time tracking + reports |
| Slack Pro | $8/mo | In-workspace messaging |
| Notion | $10/mo | Per-client notes + docs |
| Workona | $5-7/mo | Tab workspaces |
| **Total replaced** | **$33-38/mo** | **WorkTab: $12/mo** |

### Revenue Trajectory

| Milestone | Free Users | Paying | MRR | ARR |
|-----------|-----------|--------|-----|-----|
| Month 6 | 10K | 500 | $6K | $72K |
| Month 12 | 50K | 2.5K | $30K | $360K |
| Month 24 | 200K | 10K | $120K | $1.44M |
| Month 36 | 500K | 25K | $300K | $3.6M |

---

## Market Size

- **73.3 million freelancers** in the US alone (2023, Statista)
- **1.57 billion worldwide** (World Bank estimate)
- Freelance platform market: **$9.19B** (2024), growing to **$16.5B by 2030**
- 36% of the US workforce freelances
- Average freelancer manages **3-7 clients** simultaneously

| Capture Rate (US) | Users | At $12/mo | ARR |
|-------------------|-------|-----------|-----|
| 0.01% | 7,300 | $87K/mo | $1.05M |
| 0.05% | 36,600 | $439K/mo | $5.3M |
| 0.1% | 73,300 | $879K/mo | $10.6M |

---

## Competitive Landscape

### Direct Competitors

| Competitor | Price | What They Do | WorkTab Advantage |
|-----------|-------|-------------|-------------------|
| **Slack** | $8/mo | Team messaging | Built for employees in one company, not freelancers across many clients |
| **Workona** | $7/mo | Tab workspaces | No messaging, no time tracking, no invoicing |
| **Toggl** | $13/mo | Time tracking | No workspaces, no messaging, no browser-native context |
| **Notion** | $10/mo | Notes/docs | Not browser-native, no tab management, no time tracking |

### Indirect Competitors (Heavy Suites)

| Competitor | Price | Why WorkTab Wins |
|-----------|-------|-----------------|
| **HoneyBook** | $19-79/mo | Overkill CRM, not browser-native, expensive |
| **Bonsai** | $21-52/mo | Too heavy, wrong context for most freelancers |
| **Moxie** | $24-75/mo | Same — full suite when you need "just enough" |

**The gap**: Heavy suites are too much. Individual tools are too fragmented. WorkTab is the "just enough" tool for the 80% of freelancers who don't need a full CRM but can't keep working out of 40 mixed tabs.

---

## Technical Architecture

### Chrome Extension (MV3)

```
worktab/
├── manifest.json (MV3)
├── service-worker.js
│   ├── workspace-manager.js (tab isolation, switching)
│   ├── time-tracker.js (domain detection, auto-logging)
│   └── sync-engine.js (cloud sync coordinator)
├── side-panel/
│   ├── dashboard.html (workspace switcher, quick stats)
│   ├── messages.html (per-workspace chat)
│   ├── notes.html (per-workspace notepad)
│   └── time.html (time tracking view)
├── content-scripts/
│   └── domain-detector.js (identifies which client's site you're on)
├── popup/
│   └── quick-switch.html (fast workspace toggle)
└── assets/
```

### Key APIs Used

| API | Purpose |
|-----|---------|
| chrome.tabGroups | Workspace tab isolation |
| chrome.sidePanel | Persistent side panel UI (messages, notes, time) |
| chrome.storage | Local workspace data, settings |
| chrome.alarms | Periodic time tracking checkpoints |
| chrome.tabs | Tab management, switching, creation |

### Web App (Phase 2+)

| Component | Technology |
|-----------|-----------|
| Frontend | React (or Next.js) |
| Backend | Node.js / serverless |
| Database | PostgreSQL (workspaces, time logs, messages) |
| Real-time messaging | WebSocket (or Supabase Realtime) |
| Payments | Stripe Connect (reuse Hometress expertise) |
| Auth | OAuth (Google, email) |
| File storage | S3 / Cloudflare R2 |

### Stripe Connect Advantage

WorkTab uses the same Stripe Connect pattern as Hometress:
- Freelancer connects their Stripe account
- Client pays invoice through WorkTab
- Funds go directly to freelancer's bank
- WorkTab takes a small processing fee or bundles into Pro subscription

This is a **direct technology transfer** from Hometress. The Stripe Connect integration, payment flows, and payout logic are reusable.

---

## The Moat Over Time

| Timeline | What Gets Stickier |
|----------|-------------------|
| Day 1 | Tab workspaces (nice but replaceable) |
| Month 3 | Notes + time logs per client (data you don't want to lose) |
| Month 6 | Message history with clients (communication record) |
| Year 1 | Invoice history, payment records, client relationships |
| Year 2 | Your entire freelance business runs through it |

Every feature adds data. Every day of data makes switching harder. By month 6, leaving WorkTab means losing client notes, time logs, message history, and invoice records.

---

## Expansion Path

### Phase 1: Chrome Extension MVP (Months 1-4)
- Client workspaces (tab isolation + switching)
- Notes per workspace
- Auto time tracking (domain → client mapping)
- Hours dashboard
- Free on Chrome Web Store
- **Target**: 10K users

### Phase 2: Messaging + Web App (Months 4-8)
- In-browser async messaging per workspace
- Web app dashboard (time reports, workspace management)
- Cloud sync across devices
- Pro tier launches ($12/mo)
- **Target**: 50K users, $6K MRR

### Phase 3: Invoicing + Client Portal (Months 8-14)
- Generate invoices from tracked hours
- Client portal: clients see shared docs, approve hours, pay invoices
- Stripe Connect for payments
- Team tier launches ($8/user/mo)
- **Target**: 200K users, $120K MRR

### Phase 4: Platform (Year 2+)
- Workspace templates for common freelance types
- Integrations: Figma, Notion, Asana, Google Drive per workspace
- Multi-browser (Firefox, Edge)
- Mobile companion app
- Community + marketplace
- **Target**: 500K users, $300K MRR

---

## Hometress Crossover

WorkTab has a direct connection to Hometress:

- Hometress cleaning professionals ARE freelancers managing multiple clients
- WorkTab could become the business management layer for Hometress cleaners
- Stripe Connect expertise transfers directly
- The independent operator / gig worker market is the same audience
- WorkTab could eventually be offered as a value-add inside Hometress ("manage your cleaning business")

This isn't a distraction from Hometress — it's a parallel product serving the same user archetype (independent service providers) from a different angle.

---

## Exit Potential

| Exit Type | Likely Buyer | Valuation Range |
|-----------|-------------|-----------------|
| Strategic acquisition (Year 2-3) | Intuit, FreshBooks, Fiverr, Upwork | $30-100M |
| Growth acquisition (Year 3-5) | Atlassian, Salesforce, HubSpot | $100-500M |
| IPO path (Year 5+) | Public market | $500M+ |

**Comparable exits:**
- Arc / Browser Company → Atlassian: $610M
- Honey → PayPal: $4B
- Clockify → acquired (undisclosed, time tracking)
- Harvest → growing SaaS (time tracking + invoicing, $10M+ ARR)
- Bonsai → VC-funded freelance suite

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Slack builds freelancer features | Low | High | Slack optimizes for enterprise, not multi-client freelancers |
| Notion adds workspace switching | Low-Med | Medium | Notion is docs-first, not browser-native |
| Google kills extension | Very Low | High | No ad blocking, collaboration tool, minimal permissions |
| Low conversion free → paid | Medium | Medium | Free tier must be genuinely useful; Pro = sync + messaging + invoicing |
| Freelancers won't pay $12/mo | Medium | Medium | Replaces $33-38/mo in tools; offer annual discount ($96/yr = $8/mo) |
| Messaging is hard to bootstrap | Medium | Medium | Messaging is Phase 2; Phase 1 workspaces + time tracking stand alone |

---

## Decision

**WorkTab is the play.** It combines:
- The workspace/tab management insight from Better Browser
- The time tracking gap from the expired extensions (FreelanceClock)
- The Stripe Connect expertise from Hometress
- The freelancer market understanding from building a cleaning marketplace
- A clear path from extension → web app → platform

**Next step**: Define the MVP feature set and start building Phase 1.
