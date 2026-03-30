# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Felmark (tryfelmark.com) is a browser-native freelancer operating system built as a Chrome extension. It starts as a notepad + client workspaces tool — capturing the frustrated 200K users of the broken "Notepad" extension — then expands into auto time tracking, invoicing, messaging, and a full web app. It is NOT a note-taking app. It's a freelancer tool that happens to start with notes.

## Build & Development Commands

```bash
# TBD — no build system configured yet. Expected:
npm install                # Install dependencies
npm run dev                # Development with hot reload
npm run build              # Production build
npm run lint               # Run linter
```

Chrome extension testing:
1. `chrome://extensions/` → Enable Developer Mode
2. "Load unpacked" → select the `dist/` (or build output) folder
3. Reload extension after changes

## Stack

### Web App (the actual product)
- React / Next.js
- Supabase (PostgreSQL + Auth + Realtime)
- Stripe Connect (invoicing — reuse patterns from Hometress)
- Vercel (hosting)

### Chrome Extension (thin shell)
- Manifest V3
- New tab override or popup redirect to `app.tryfelmark.com`
- ~50 lines of code total
- Future: content script for domain detection (auto time tracking)

### Project Structure
```
Felmark/
├── CLAUDE.md                      ← This file
├── Prototype/
│   └── FreelancerPad.jsx          ← Block editor prototype (visual reference)
├── business/                      ← Strategy docs, research, concepts
│   ├── BUSINESS_STRATEGY.md
│   ├── WORKTAB_CONCEPT.md
│   └── ...
├── conductor/                     ← Project Operations Hub
│   ├── THOUGHTS.md
│   ├── HANDOFF.md
│   ├── ACTIVE_CONTEXT.md
│   ├── CONDUCTOR_HEALTH.md
│   ├── DEVELOPMENT_BRIEF.md
│   ├── journal/
│   ├── missions/
│   ├── skills/
│   ├── sops/
│   └── templates/
├── app/                           ← Web app (Next.js — to be created)
│   ├── ...                        ← The actual product
│   └── ...
├── extension/                     ← Chrome extension shell (~50 lines)
│   ├── manifest.json              ← MV3 manifest
│   ├── newtab.html                ← iframe to app.tryfelmark.com (or redirect)
│   └── icons/
└── ...
```

## Architecture

**The extension is a thin shell. The app lives on the server.**

```
Chrome Extension (~50 lines)          Web App (app.tryfelmark.com)
┌─────────────────────────┐           ┌──────────────────────────┐
│ manifest.json           │           │ React dashboard          │
│ newtab.html (iframe) or │──iframe──▶│ Auth (Supabase)          │
│ popup (redirect)        │   or      │ Database                 │
│                         │  redirect │ Stripe Connect           │
│ Zero business logic     │           │ All business logic       │
└─────────────────────────┘           └──────────────────────────┘
```

- Extension contains zero business logic — just a URL pointing to the web app
- Unpacking the .crx reveals only a manifest and an iframe/redirect — source stays private
- Web app updates ship instantly without Chrome Web Store review cycles
- Same web app serves extension users AND direct visitors

### Web App Features (app.tryfelmark.com)
- **Client workspaces**: Each client gets isolated notes, time tracking, and (later) messaging
- **Block editor**: Notion-style rich text with slash commands, drag-and-drop, format bar
- **Auto time tracking**: Domain-to-client mapping (future: via extension content script)
- **Hours dashboard**: Hours vs. budget per client, daily/weekly/monthly rollup
- **Dark mode**: Light / dark / system auto

### MVP Feature Set (Phase 1)
- Client workspaces (create, switch, organize by client)
- Notes per workspace (block editor, autosave, search)
- Dark mode (light / dark / system auto)
- Export (Markdown, plain text, JSON)
- Chrome extension shell (new tab override or toolbar popup — TBD)

### Pricing Model
- **Free**: 3 workspaces, local storage, basic features
- **Pro** ($12/mo): Unlimited workspaces, cloud sync, time tracking, invoicing
- **Team** ($8/user/mo): Shared workspaces, messaging, client portals

## Project File Locations

**WRITE RULE**: When creating or saving `.md` files for the conductor (missions, standards, reports, audits, tracks, skills, strategy, design specs), **always write them to `conductor/`** (`/Users/donteennis/Felmark/conductor/`).

### Repository: `/Users/donteennis/Felmark/`

## Ground Rules

### 0. Worktree Required (NON-NEGOTIABLE)
- **ALL code-writing agent work MUST run in a git worktree** (`isolation: "worktree"`).
- File watchers (linters, formatters, IDE extensions) in the main worktree modify files between edits, causing `old_string` mismatches, stale reads, and 3x slowdown.
- Worktrees give the agent an isolated repo copy. No interference. Edit freely, commit when done, merge back clean.
- **This applies to**: sprints, missions, bug fixes, feature builds, refactors — any task that modifies `dashboard/src/` files.
- **Exceptions**: Conductor-only edits (THOUGHTS.md, HANDOFF.md, mission docs) can run in the main worktree since they're not watched by linters.

### 1. No Scope Creep
- **STOP -> PROPOSE -> WAIT** before expanding scope beyond the current task.

### 2. Structure Before Code
Before building any feature that creates 3+ files, answer these four questions (out loud or in a plan):
1. **Where does it live?** — Which folder? New folder or existing? Match the slash menu category.
2. **Does shared/ already have what I need?** — Check for hooks (useClickOutside, useEditableField, etc.) and components (Avatar, IconButton, EmptyState) before re-implementing.
3. **Which hotspot files does it touch?** — If it touches Editor.tsx, types.ts, or constants.ts, note the exact additions (import, CONTENT_DEFAULTS entry, contentBlockMap entry, margin labels).
4. **One file or a folder?** — If the component + CSS exceeds ~250 lines, give it its own folder. If it's a block type, follow the category folder pattern (`blocks/content/`, `blocks/collab/`, etc.).

This is not a document — it's a 30-second mental checklist. The goal is to build into the right structure the first time, not refactor after.

### 3. Conductor Brain (Self-Sustaining -- CRITICAL)

The Conductor is a self-sustaining knowledge system. These behaviors are **automatic** -- the AI executes them without being asked.

#### On Session Start (Silent Health Check + Handoff + Thoughts + Guardrail)
- Run `conductor/CONDUCTOR_HEALTH.md` checks silently. Only speak up if issues found.
- Check: standards past review dates, stale missions, skills out of sync, journal gaps, active context freshness, handoff existence.
- Read `conductor/HANDOFF.md` if it exists -- it has context from the previous session. Mention briefly if relevant to the current task.
- Check `conductor/THOUGHTS.md` for stale `ACTIVE` entries (older than 4 hours). Resolve or clear them.
- **Read `conductor/GUARDRAIL.md`** — check the Codebase Pulse thresholds. Run `find dashboard/src -name "*.tsx" -o -name "*.ts" -o -name "*.css" | wc -l` and compare. If any metric crossed into caution or split, flag it immediately. If the Feature Registry or Block Registry is stale (features exist on disk but aren't listed), fix it before starting work.
- If all healthy and no handoff, say nothing.

#### During Work (Thoughts -- Real-Time Status)
- **On task start**: Add a row to `conductor/THOUGHTS.md` Current table with `ACTIVE` status, agent name, one-sentence task description, and timestamp.
- **On task complete**: Update status to `COMPLETE`, then move the entry to the Recent table (cap at 5, drop oldest).
- Team agents use their name (architect, data-hawk). Solo sessions use `claude-main`.
- One sentence max per entry. Detail goes in the journal.
- **MANDATORY**: When adding, deleting, renaming, or retiring a feature, block type, or primary file, update `conductor/GUARDRAIL.md` in the same commit. Update the Feature Registry, Block Registry, and Codebase Pulse metrics. This is not a follow-up task — it happens in the same pass as the code change.

#### On Session Close (Learning Capture + Context Update + Handoff)
- After any non-trivial session (debug, feature build, audit, refactor):
  1. Mark any remaining `ACTIVE` entries in THOUGHTS.md as `COMPLETE` (or clear if abandoned).
  2. Write a journal entry to `conductor/journal/YYYY-MM-DD_<slug>.md` following the template in `journal/README.md`.
  3. Update `conductor/journal/INDEX.md` with the new entry's tags (increment counts, add filename).
  4. Regenerate `conductor/ACTIVE_CONTEXT.md` with current mission status, recent journal entries, and pattern alerts.
  5. Write `conductor/HANDOFF.md` if there's in-progress work or gotchas (per `conductor/sops/SESSION_HANDOFF.md`).
  6. Scan INDEX.md for pattern matches (3+ same tag -> propose standard promotion).
  7. Verify `conductor/GUARDRAIL.md` is current — Feature Registry, Block Registry, and Codebase Pulse all match reality. Update the "Last synced" date. If any threshold was crossed during the session, note it in HANDOFF.md.
- Skip if session was purely conversational or informational.

#### After Creating Any New Standard, Skill, or Mission (Integrity Check)
- Run the post-creation integrity check from `CONDUCTOR_HEALTH.md` automatically.
- Fix all items marked failed (missing from CLAUDE.md, missing headers, not synced).
- Report advisory items as warnings.
- **Do NOT ask permission** -- this is a mandatory quality gate.

#### Standards Refresh (Proactive)
- All standards have `Last Reviewed` and `Next Review` dates. If current date > next review, notify user.

#### Pattern Evolution (Automatic)
- When 3+ journal entries share the same tag and describe the same root pattern, propose promoting it to a ground rule or standard update.
- When a journal entry contradicts an existing standard, flag it for review -- do NOT silently update.

## Conductor -- Project Operations Hub

All engineering standards, active missions, audit reports, and project tracking live in **`conductor/`**. Read the relevant standard before starting any task.

| Document | Purpose |
|----------|---------|
| `CONDUCTOR_HEALTH.md` | Self-audit protocol (runs at session start) |
| `THOUGHTS.md` | Real-time agent scratchpad (active task status) |
| `HANDOFF.md` | Session continuity context |
| `ACTIVE_CONTEXT.md` | Current project snapshot |
| `GUARDRAIL.md` | Feature inventory, block registry, codebase metrics, and scale thresholds — read on session start, updated on every feature change |
| `DEVELOPMENT_BRIEF.md` | Master plan: milestones, missions, strategy, ideas |
| `agent-team/AGENT_TEAM.md` | Multi-agent coordination -- roles, collision prevention |
| `agent-team/agent-sprint/SPRINT_SOP.md` | Sprint execution protocol -- claiming, status, archival |
| `sops/AAS_SOP.md` | Three-layer quality review (Advocate -> Adjudicate -> Suitability) |
| `sops/MULTI_AGENT_WORKFLOW.md` | Collision prevention & coordination |
| `sops/SESSION_HANDOFF.md` | Handoff protocol details |
| `standards/SLASH_COMMAND_CHECKLIST.md` | Required touchpoints when adding a new `/` block type (includes AI prompt sync) |
| `standards/UI_UX_GUIDELINES.md` | Source of truth for all design tokens, components, and interaction patterns |
