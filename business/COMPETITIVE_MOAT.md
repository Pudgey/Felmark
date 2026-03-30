# Competitive Moat — Why Felmark Isn't a Lower-Cost HoneyBook

**Created**: 2026-03-30
**Type**: Strategy
**Status**: Active thesis

---

## The Trap

It's tempting to look at what we've built — workspaces, calendar, pipeline, invoicing concepts, messaging — and see a HoneyBook clone at lower cost. That's the wrong frame. Competing on price against an established CRM is a losing game. We need to compete on category.

**HoneyBook is a CRM that freelancers tolerate.**
**Felmark is a workspace they live in.**

That's not a tagline — it's an architectural decision that changes everything downstream.

---

## What HoneyBook Actually Is

HoneyBook is built around the **deal**. The mental model:

```
Lead → Proposal → Contract → Invoice → Payment
```

Everything serves the pipeline. The document editor is an afterthought (rich text circa 2015). Notes are barely functional. There's no concept of a "workspace per client" — it's a contact record with files attached. The calendar shows meetings, not project work. There's no awareness of what happens outside the HoneyBook tab.

**Their strengths:** Automations, branded proposals, payment processing, established brand.
**Their weaknesses:** The editor sucks, no real document workflow, zero context awareness, no block-level intelligence, no ambient work tracking.

---

## Where Felmark Diverges

### The Organizing Unit

| HoneyBook | Felmark |
|-----------|---------|
| Contact record | Client workspace |
| Deal pipeline | Document-first workflow |
| Files attached to contacts | Blocks embedded in living documents |
| Calendar = meetings | Calendar = project work + deadlines |
| "Log in to update your CRM" | "Your CRM updates itself from your browser" |

HoneyBook forces freelancers to context-switch into "CRM mode." Open the app, update the pipeline, send the invoice, close the app, go back to actual work. Felmark lives where the work already happens — the browser.

### The Three Things HoneyBook Can't Do

#### 1. Context Engine (M2 — The Killer Feature)

Felmark's Chrome extension sees which domains you visit, which tabs are open, how long you spend. It can:

- **Auto-log time** to the right client based on domain mapping (figma.com/meridian → Meridian Studio)
- **Surface relevant notes** when you visit a client's website or Figma file
- **Suggest next actions** based on work patterns ("You spent 3 hours on Meridian today but haven't updated the deliverable status")
- **Detect client communication** — Gmail tab open with sarah@meridianstudio.co → log it to the workspace activity feed

No freelancer tool does this. HoneyBook, Dubsado, Bonsai — they all require manual data entry. Felmark's context engine means the system knows what you're doing before you tell it.

**Why this is a moat:** It requires a browser extension. Web-only competitors can't replicate it. The more you use Felmark, the smarter it gets about your work patterns. That's a switching cost that compounds.

#### 2. Document-First Workflow (M1-M3 — What We're Building Now)

In HoneyBook, you create:
1. A proposal (separate document)
2. A contract (separate document)
3. An invoice (separate document)

Three disconnected artifacts. If the scope changes, you update three places. In Felmark:

```
One Document, One Truth
┌─────────────────────────────────────┐
│ H1: Brand Guidelines v2            │
│                                     │
│ {deliverable} Logo Usage Rules      │
│   Status: Approved ✓                │
│   → auto-generated invoice line     │
│                                     │
│ {deliverable} Color Palette         │
│   Status: In Progress ◐             │
│   Files: palette-v3.fig             │
│   Approvals: Sarah ✓ Jamie ·       │
│                                     │
│ {money} Invoice #047                │
│   $2,400 — 50% deposit             │
│   Status: Sent · Viewed 2x         │
│   [Pay Now →]                       │
│                                     │
│ {deadline} Due Apr 3 — 4d left      │
│ {progress} 65% complete             │
└─────────────────────────────────────┘
```

A proposal section becomes an approved scope. Deliverable blocks track progress and approvals. When a deliverable is marked "approved," the money block auto-populates the invoice line item. The client sees a clean, branded document with a "Pay Now" button — not a separate invoice email.

**The flow:** Pitch → Scope → Track → Invoice → Pay. All in one document. One URL. One source of truth.

**Why this is a moat:** It's a fundamentally different data model. HoneyBook would have to rebuild their entire architecture to support block-level intelligence inside documents. They won't.

#### 3. The Wire (M4+ — The Network Effect)

Industry signals that no CRM has:

- What are other freelancers in your niche charging for similar projects?
- What proposal structures are winning? (anonymized, aggregated)
- What clients are shopping for services in your area?
- Benchmark your rates, turnaround times, and client satisfaction against the market

This turns Felmark from a tool (linear value) into a network (exponential value). Every freelancer who uses Felmark makes the data better for everyone else. HoneyBook has no equivalent — they're a SaaS tool, not a marketplace intelligence platform.

**Why this is a moat:** Network effects compound. The 1000th user makes the platform 10x more valuable than the 100th. HoneyBook's 100,000 users are just 100,000 isolated instances of the same software.

---

## The Connection Problem (Right Now)

We have powerful individual features:
- Block editor
- Smart blocks (revenue, deadline, progress, status, timer, approval)
- Deliverable blocks (status workflow, files, comments, approvals)
- Money blocks (rate calc, milestone payments, expense tracker, tax estimates)
- Calendar (live deadlines from project data)
- Workspace Home (client dashboard)
- Dashboard Home (business overview)
- Pipeline concept
- Search, Conversations, Launchpad

**But they're not connected.** The deliverable block doesn't trigger the money block. The calendar doesn't know about deliverable due dates (only project-level). The pipeline seed data doesn't reflect actual workspace states. The workspace home activity feed is hardcoded.

### What Needs Connecting (Priority Order)

#### Connection 1: Deliverable → Invoice Flow
**When a deliverable is marked "approved":**
- Auto-generate a line item in the nearest money block
- Or prompt: "Generate invoice for approved deliverables?"
- Amount derived from deliverable's allocated budget (if set)

**Why it matters:** This is the "aha" moment. The freelancer approves work and the invoice writes itself. That's the workflow gravity that makes them unable to leave.

#### Connection 2: Calendar ↔ Deliverables
**Currently:** Calendar shows project-level deadlines.
**Should also show:** Individual deliverable due dates, milestone dates from money blocks, approval deadlines.

**Why it matters:** Freelancers don't think in "project due dates" — they think in "this deliverable is due Tuesday." The calendar should reflect that granularity.

#### Connection 3: Workspace Activity → Real Events
**Currently:** Hardcoded seed data in workspace home and dashboard.
**Should be:** An event bus that captures real actions:
- Document edited (which blocks changed)
- Deliverable status changed
- File uploaded
- Comment added
- Invoice sent/viewed/paid
- Project created/archived

**Why it matters:** The activity feed is the heartbeat of the workspace. If it's fake, the workspace home feels fake. Real events make it feel alive.

#### Connection 4: nox → Full System
**Currently:** Concept doc only.
**Should create:**
- Project in workspace
- Document with deliverable blocks
- Calendar events for milestones
- Pipeline deal
- All from one sentence

**Why it matters:** nox is the "zero to working" moment. If it creates everything at once, the freelancer feels the system is unified — not a collection of separate tools.

#### Connection 5: Dashboard Home → Real Data
**Currently:** Stats row uses computed project data, but pipeline, earnings, and activity are seed data.
**Should be:** Pipeline reflects actual workspace states (active projects = "Active" stage, completed = "Completed"). Earnings derived from money blocks/invoices. Activity from the event bus.

**Why it matters:** The dashboard is the first thing a freelancer sees. If the numbers don't match reality, trust erodes immediately.

---

## Pricing Moat

| | HoneyBook | Felmark |
|---|-----------|---------|
| Free | No | 3 workspaces, local storage |
| Starter | $19/mo | Free |
| Pro | $39/mo | $12/mo |
| Premium | $79/mo | $24/mo (Team) |

We're not "cheaper HoneyBook." We're a different product at a different price point. The free tier is genuinely useful (not crippled). The Pro tier at $12/mo undercuts HoneyBook's $39/mo while offering features they don't have (context engine, smart blocks, block-level workflow).

**The pricing moat:** HoneyBook can't drop to $12/mo without destroying their revenue. We can start there because our cost structure is different (no sales team, no enterprise features, browser-native architecture).

---

## What to Build Next (Not More Features)

The next phase is **connecting what exists**, not adding new surfaces:

| Priority | Connection | Effort | Impact |
|----------|-----------|--------|--------|
| 1 | Event bus — capture real actions across the app | Medium | Unlocks everything else |
| 2 | Activity feed from event bus (workspace home, dashboard) | Small | Makes the product feel alive |
| 3 | Deliverable → Money block auto-generation | Medium | The "aha" workflow moment |
| 4 | Calendar ← deliverable/milestone dates | Small | Granular schedule awareness |
| 5 | nox full wiring (project + deliverables + calendar + pipeline) | Medium | Zero-to-working in 3 seconds |
| 6 | Dashboard stats from real data | Small | Trust in the numbers |

---

## The One-Sentence Pitch

**HoneyBook:** "Manage your client business."
**Felmark:** "Your browser already knows your business. Felmark just makes it visible."

---

## Success Metrics (How We Know It's Working)

- **Retention signal:** Do freelancers keep the extension installed after 30 days?
- **Context engine adoption:** What % of time tracking is auto-logged vs manual?
- **Workflow gravity:** Do users create invoices from deliverable blocks (connected flow) or manually?
- **Document engagement:** Time spent in Felmark docs vs switching to Google Docs/Notion
- **The Wire effect:** Do users check industry benchmarks before setting rates?

If freelancers are auto-tracking time, generating invoices from deliverables, and checking The Wire before pricing proposals — we've won. That's a workflow they can't replicate by switching back to HoneyBook + Notion + Toggl + Google Docs.
