# Development Brief — Single Source of Truth

> **Auto-maintained**: Every session that creates a mission, completes a milestone item, or adds a strategy doc must update this file.
>
> **Last updated**: 2026-03-29

---

## How This Doc Works

Three tiers:
1. **Milestones** — sequenced by user need, gated
2. **Missions** — scoped work units linked to milestones
3. **Strategy & Ideas** — future thinking, not yet scoped into missions

**Rules:**
- New missions get added here when created (with milestone tag)
- Completed items get checked off and dated
- Strategy docs that become missions get moved from Tier 3 → Tier 2
- AI agents read this before `/mission` to avoid duplicate work

---

## Tier 1: Milestones

### M1: Chrome Extension MVP — "It Works"
> **Gate**: Freelancer can create client workspaces, take notes per client, and see auto-tracked time per domain. Dark mode, autosave, search. Free on Chrome Web Store.
> **Status**: Not started

| Item | Status | Notes |
|------|--------|-------|
| MV3 manifest + service worker scaffold | Not started | |
| Side panel UI (workspace switcher + notes) | Not started | |
| Client workspaces (create, switch, delete) | Not started | Tab isolation via tabGroups |
| Notes per workspace (rich text, autosave) | Not started | FreelancerPad.jsx is a reference prototype |
| Dark mode (light / dark / system auto) | Not started | |
| Auto time tracking (domain-to-client mapping) | Not started | Content script + alarms |
| Hours dashboard (per client, daily/weekly) | Not started | |
| Page-linked notes (auto-tied to URL) | Not started | |
| Search (fuzzy, cross-workspace) | Not started | |
| Export (Markdown, plain text, JSON) | Not started | |
| Chrome Web Store listing + launch | Not started | |

### M2: Pro Tier + Time Tracking — "It Pays"
> **Gate**: Cloud sync working, time tracking polished, first paying users at $12/mo.
> **Status**: Not started

| Item | Status | Notes |
|------|--------|-------|
| Cloud sync (Supabase) | Not started | |
| Pro paywall ($12/mo, unlimited workspaces) | Not started | Stripe subscriptions |
| Hours vs. budget per client | Not started | |
| Web clipper (highlight → save to workspace) | Not started | |
| Templates (meeting notes, project brief) | Not started | [Concept doc](missions/TEMPLATE_SYSTEM_CONCEPT.md) |
| Reminders (browser notifications) | Not started | |
| Export to PDF | Not started | |

### M3: Invoicing + Client Portal — "It Runs Your Business"
> **Gate**: Freelancer can generate invoices from tracked hours, clients can view/pay. Stripe Connect processing payments.
> **Status**: Not started

| Item | Status | Notes |
|------|--------|-------|
| One-click invoice from tracked hours | Not started | |
| Stripe Connect integration | Not started | Reuse Hometress patterns |
| Client portal (shared docs, approve hours, pay) | Not started | |
| Shared workspaces (invite client/collaborator) | Not started | |
| Comments on notes | Not started | |

### M4: Web App + Analytics — "It's a Platform"
> **Gate**: Full web dashboard, revenue analytics, tax prep reports. Product transcends the extension.
> **Status**: Not started

| Item | Status | Notes |
|------|--------|-------|
| Web dashboard (React/Next.js on Vercel) | Not started | |
| Revenue analytics per client | Not started | |
| Tax prep reports | Not started | |
| Client profitability analysis | Not started | |
| Mobile-responsive web app | Not started | |

---

## Tier 2: Missions

### Active
| Mission | Milestone | Status | Doc |
|---------|-----------|--------|-----|
| MVP Launch — Extension Shell + Web App | M1 | Planning | [MISSION_MVP_LAUNCH.md](missions/MISSION_MVP_LAUNCH.md) |

### Planning
| Mission | Milestone | Doc |
|---------|-----------|-----|
| nox AI — Rapid Project Creation | M1 | [MISSION_NOX_AI.md](missions/MISSION_NOX_AI.md) |

### Completed
| Mission | Completed | Doc |
|---------|-----------|-----|
| Conversations V2 | 2026-03-29 | [MISSION_CONVERSATIONS_V2.md](missions/MISSION_CONVERSATIONS_V2.md) |

---

## Tier 3: Strategy & Ideas

| Doc | Summary | Potential Milestone |
|-----|---------|-------------------|
| [BUSINESS_STRATEGY.md](../business/BUSINESS_STRATEGY.md) | Full business strategy, pricing, market analysis, competitive landscape | Reference |
| [WORKTAB_CONCEPT.md](../business/WORKTAB_CONCEPT.md) | WorkTab concept doc — core product vision and feature set | Reference |
| [COMPETITIVE_ANALYSIS.md](Reports/COMPETITIVE_ANALYSIS.md) | Industry competitor analysis | Reference |
| [PIPELINE_CONCEPT.md](missions/PIPELINE_CONCEPT.md) | Kanban deal pipeline — Lead → Proposed → Active → Payment → Done | M2 |
| [SEARCH_CONCEPT.md](missions/SEARCH_CONCEPT.md) | Universal search — projects, docs, invoices, clients, messages, commands | M1 |
| — | Async messaging per workspace | M3+ |
| — | Team workspaces + real-time collab | M4 |
| — | Template marketplace | M4+ |
| — | API + integrations (Figma, Notion, Asana) | M4+ |
| — | Mobile companion app | M4+ |
| — | Context Engine AI (smart suggestions from browsing patterns) | M4+ |

---

## Maintenance Protocol

| Trigger | Action |
|---------|--------|
| New mission created | Add to Tier 2 with milestone tag |
| Mission completed | Check off in Tier 1, update Tier 2 status |
| New strategy/idea doc written | Add to Tier 3 |
| Strategy doc promoted to mission | Move from Tier 3 → Tier 2 |
| Quarterly review | Prune stale Tier 3, reprioritize |
