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
├── .claude/skills/                ← Claude Code skills (SKILL.md per skill, plain Markdown)
├── .agents/skills/                ← Codex CLI skills (SKILL.md per skill, YAML frontmatter + Markdown)
├── conductor/                     ← Project Operations Hub
│   ├── THOUGHTS.md
│   ├── HANDOFF.md
│   ├── ACTIVE_CONTEXT.md
│   ├── CONDUCTOR_HEALTH.md
│   ├── DEVELOPMENT_BRIEF.md
│   ├── journal/
│   ├── missions/
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

## Skills (Multi-AI Setup)

This project uses multiple AI coding agents. Skills (slash commands / workflows) are maintained in parallel across all supported agents. **When creating or modifying a skill, you MUST update it for every AI tool, not just the one you're currently running in.**

### Skill Locations

| AI Tool | Skills Directory | File Format | Invocation |
|---------|-----------------|-------------|------------|
| **Claude Code** | `.claude/skills/<name>/SKILL.md` | Plain Markdown | `/skillname` |
| **Codex CLI** | `.agents/skills/<name>/SKILL.md` | YAML frontmatter + Markdown | `$skillname` or `/skillname` |
| **Conductor** | `conductor/skills/<name>/PROTOCOL.md` | Shared logic source | Referenced by wrappers |

### Format Differences

**Claude Code** (`.claude/skills/<name>/SKILL.md`):
```markdown
Run an accessibility audit on: $ARGUMENTS

Follow `conductor/skills/a11y/PROTOCOL.md`.
...
```

**Codex CLI** (`.agents/skills/<name>/AGENT.md`):
```markdown
---
name: "a11y"
description: "Run an accessibility audit on the specified target."
---

# A11y — Accessibility Audit

Run an accessibility audit on the specified target.

Follow `conductor/skills/a11y/PROTOCOL.md`.
...
```

### Rules for Skill Changes (NON-NEGOTIABLE)

1. **Every new skill** must be created in BOTH `.claude/skills/` AND `.agents/skills/` in the same pass.
2. **Every skill edit** must be mirrored to the other AI's version in the same pass.
3. **Skill logic lives in `conductor/skills/<name>/PROTOCOL.md`** — the per-AI files are thin wrappers that point to the conductor source. This keeps behavior identical across agents.
4. **Deleting a skill** means removing it from both directories and from `conductor/skills/` if it exists there.
5. After any skill change, run the conductor integrity check to verify sync.

### Other AI Configuration Files

| File | AI Tool | Purpose |
|------|---------|---------|
| `CLAUDE.md` | Claude Code | Project instructions (this file) |
| `AGENTS.md` | Codex CLI | Project instructions (Codex equivalent) |
| `.claude/settings.json` | Claude Code | Hooks, permissions, config |
| `.codex/config.toml` | Codex CLI | Model, approval policies, sandbox config |

## Ground Rules

### 0. Worktree Required (NON-NEGOTIABLE)
- **ALL code-writing agent work MUST run in a git worktree** (`isolation: "worktree"`).
- File watchers (linters, formatters, IDE extensions) in the main worktree modify files between edits, causing `old_string` mismatches, stale reads, and 3x slowdown.
- Worktrees give the agent an isolated repo copy. No interference. Edit freely, commit when done, merge back clean.
- **This applies to**: sprints, missions, bug fixes, feature builds, refactors — any task that modifies `dashboard/src/` files.
- **Exceptions**: Conductor-only edits (THOUGHTS.md, HANDOFF.md, mission docs) can run in the main worktree since they're not watched by linters.

### 0.5 Read Before You Write (NON-NEGOTIABLE)
- **Before modifying ANY file, read its current contents.** Do not regenerate a file from memory or context — the file on disk is the source of truth.
- **Never overwrite functionality you didn't add.** If a file has features, props, sections, or logic you don't recognize, those were added by another session. Preserve them. If your task conflicts with existing work, STOP and ask the user.
- **Refactors must preserve, not replace.** If you're restructuring a file (renaming, extracting, reorganizing), diff your output against the original. Every prop, handler, section, and import in the original must appear in the result unless explicitly removed by the user.
- **This exists because**: multiple AI agents work on this codebase. A broad refactor by one agent has silently reverted days of work by another. This rule prevents that.

### 1. No Scope Creep
- **STOP -> PROPOSE -> WAIT** before expanding scope beyond the current task.

### 2. Organization Over Speed (NON-NEGOTIABLE)

**Building on disorganized code creates more disorganized code.** Before writing a single line, assess the health of the area you're about to touch. If it needs restructuring, propose that first — do NOT pile more code on top of a mess.

#### Hard Thresholds
| Metric | Green | Yellow (propose refactor) | Red (refactor before proceeding) |
|--------|-------|---------------------------|----------------------------------|
| File line count | < 500 | 500–800 | > 800 |
| Folder siblings | < 10 | 10–15 | > 15 |
| Component concerns | 1 | 2 (flag it) | 3+ (split immediately) |
| Import depth | < 4 levels | 4 levels | > 4 levels (restructure) |

#### Automatic Checks (every task)
Before modifying any file, the AI MUST:
1. **Check line count** — `wc -l` the target file. If yellow/red, propose refactoring to the user before adding code.
2. **Check folder size** — `ls | wc -l` the target folder. If yellow/red, propose splitting.
3. **Check responsibility** — Is this file doing one thing? If it's rendering, routing, AND managing state for unrelated features, it needs splitting. A component should never render views it isn't responsible for.
4. **Ask if unclear** — "This file is at 650 lines and I'm about to add 80 more. Should I refactor first?" is always the right question.

#### Canonical Folder Hierarchy
```
dashboard/src/
├── app/                        ← Next.js app router (page.tsx = state + layout only)
├── views/                      ← View routing layer (ViewRouter + per-view wrappers)
├── components/
│   ├── workstation/            ← Flagship product — all workstation features
│   │   ├── editor/             ← Block editor
│   │   │   ├── blocks/         ← ALL block types (one folder per block)
│   │   │   ├── chrome/         ← Editor UI (command-bar, slash-menu, format-bar, etc.)
│   │   │   └── panels/         ← Slide-out panels (conversation, cat, share-modal)
│   │   ├── calendar/
│   │   ├── search/
│   │   ├── pipeline/
│   │   ├── finance/
│   │   ├── wire/
│   │   ├── team/
│   │   ├── services/
│   │   ├── templates/
│   │   ├── forge-paper/
│   │   ├── dashboard/
│   │   └── terminal-welcome/
│   ├── workspace/              ← Separate product surface
│   ├── rail/                   ← App shell — navigation rail
│   ├── sidebar/                ← App shell — sidebar
│   ├── shared/                 ← Shared primitives, hooks, utilities
│   ├── comments/               ← Cross-cutting (shared by workstation + workspace)
│   ├── activity/               ← Cross-cutting
│   ├── history/                ← Cross-cutting
│   ├── notifications/          ← Cross-cutting
│   └── terminal/               ← Cross-cutting
├── forge/                      ← State management / business logic
└── lib/                        ← Types, constants, utilities
```

**New features go in the right place the first time.** If you're unsure where something belongs, ask. Moving files later is expensive and creates merge conflicts across every open worktree.

#### When to Propose Refactoring
- You're about to add a feature and the target file is yellow/red
- A component is rendering views for 3+ unrelated concerns
- You notice routing logic inside a non-router component
- A folder has become a dumping ground (15+ siblings with no sub-organization)
- Import paths are 4+ levels deep (`../../../../shared/`)

**The user expects you to flag these proactively.** Don't wait to be asked. "I noticed X is at 700 lines — want me to split it before adding Y?" is the standard.

See `conductor/standards/ORGANIZATION.md` for the full standard with examples.

### 3. Structure Before Code

**End goal**: This codebase will be handed to a developer or a team of developers. Every structural decision should make the code easier to navigate, understand, and extend as it grows. Scalable, enterprise-grade architecture is not a future milestone — it's how we build from day one.

Before building any feature that creates 3+ files, answer these five questions (out loud or in a plan):
1. **Where does it live?** — Which folder? New folder or existing? Match the slash menu category.
2. **Does shared/ already have what I need?** — Check for hooks (useClickOutside, useEditableField, etc.) and components (Avatar, IconButton, EmptyState) before re-implementing.
3. **Which hotspot files does it touch?** — If it touches Editor.tsx, types.ts, or constants.ts, note the exact additions (import, CONTENT_DEFAULTS entry, contentBlockMap entry, margin labels).
4. **One file or a folder?** — If the component + CSS exceeds ~250 lines, give it its own folder. If it's a block type, follow the category folder pattern (`blocks/content/`, `blocks/collab/`, etc.).
5. **Will this grow?** — If the feature is likely to gain variants, modes, sub-features, or integrations, start with a folder structure even if the first file is small. A folder with one file is cheaper than a file that becomes a folder later. Signals that something will grow: it has a type/mode picker, it's a category that will expand, the user mentioned future additions, or it touches a domain with natural expansion (e.g. payments → invoices → subscriptions).
6. **MANIFEST.md** — Every component folder MUST have a `MANIFEST.md`. When creating a new folder, create its manifest in the same pass. When modifying files in a folder, update the manifest if exports, dependencies, or importers changed. The manifest is the folder's self-documentation — it declares what's here, what it needs, and who uses it. Format: Exports, Dependencies, Imported By, Files. This is non-negotiable.

This is not a document — it's a 30-second mental checklist. The goal is to build into the right structure the first time so that a new developer joining the project can navigate the codebase by folder names alone.

### 3. Conductor Brain (Self-Sustaining -- CRITICAL)

The Conductor is a self-sustaining knowledge system. These behaviors are **automatic** -- the AI executes them without being asked.

#### On Session Start (Silent Health Check + Handoff + Thoughts + Guardrail + Forge)
- Run `conductor/CONDUCTOR_HEALTH.md` checks silently. Only speak up if issues found.
- Check: standards past review dates, stale missions, skills out of sync, journal gaps, active context freshness, handoff existence.
- Read `conductor/HANDOFF.md` if it exists -- it has context from the previous session. Mention briefly if relevant to the current task.
- Check `conductor/THOUGHTS.md` for stale `ACTIVE` entries (older than 4 hours). Resolve or clear them.
- **Read `conductor/GUARDRAIL.md`** — check the Codebase Pulse thresholds. Run `find dashboard/src -name "*.tsx" -o -name "*.ts" -o -name "*.css" | wc -l` and compare. If any metric crossed into caution or split, flag it immediately.
- **Read `conductor/FORGE_MAP.md`** — the dependency map. Before modifying any file, check the map for what imports it and what it imports. If the map is stale (file counts don't match, listed files don't exist), run `/forge` to rebuild it before proceeding.
- If all healthy and no handoff, say nothing.

#### During Work (Thoughts -- Real-Time Status)
- **On task start**: Add a row to `conductor/THOUGHTS.md` Current table with `ACTIVE` status, agent name, one-sentence task description, and timestamp.
- **On task complete**: Update status to `COMPLETE`, then move the entry to the Recent table (cap at 5, drop oldest).
- Team agents use their name (architect, data-hawk). Solo sessions use `claude-main`.
- One sentence max per entry. Detail goes in the journal.
- **MANDATORY**: When adding, deleting, renaming, or retiring a feature, block type, or primary file, update `conductor/GUARDRAIL.md` in the same commit. Update the Feature Registry, Block Registry, and Codebase Pulse metrics. This is not a follow-up task — it happens in the same pass as the code change.
- **MANDATORY**: When modifying any file in a component folder, read that folder's `MANIFEST.md` first. If the change affects exports, dependencies, or importers, update the manifest in the same commit. When creating a new folder, create its `MANIFEST.md` in the same pass.

#### On Session Close (Learning Capture + Context Update + Handoff)
- After any non-trivial session (debug, feature build, audit, refactor):
  1. Mark any remaining `ACTIVE` entries in THOUGHTS.md as `COMPLETE` (or clear if abandoned).
  2. Write a journal entry to `conductor/journal/YYYY-MM-DD_<slug>.md` following the template in `journal/README.md`.
  3. Update `conductor/journal/INDEX.md` with the new entry's tags (increment counts, add filename).
  4. Regenerate `conductor/ACTIVE_CONTEXT.md` with current mission status, recent journal entries, and pattern alerts.
  5. Write `conductor/HANDOFF.md` if there's in-progress work or gotchas (per `conductor/sops/SESSION_HANDOFF.md`).
  6. Scan INDEX.md for pattern matches (3+ same tag -> propose standard promotion).
  7. Verify `conductor/GUARDRAIL.md` is current — Feature Registry, Block Registry, and Codebase Pulse all match reality. Update the "Last synced" date. If any threshold was crossed during the session, note it in HANDOFF.md.
  8. If files were created, deleted, or moved during the session, run `/forge` to rebuild `conductor/FORGE_MAP.md`. The dependency map must match reality before closing.
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
| `FORGE_MAP.md` | Living dependency map — routes, hotspots, block registry, import graph. Rebuilt by `/forge` scan, never by memory. Non-negotiable. |
| `DEVELOPMENT_BRIEF.md` | Master plan: milestones, missions, strategy, ideas |
| `agent-team/AGENT_TEAM.md` | Multi-agent coordination -- roles, collision prevention |
| `agent-team/agent-sprint/SPRINT_SOP.md` | Sprint execution protocol -- claiming, status, archival |
| `sops/AAS_SOP.md` | Three-layer quality review (Advocate -> Adjudicate -> Suitability) |
| `sops/MULTI_AGENT_WORKFLOW.md` | Collision prevention & coordination |
| `sops/SESSION_HANDOFF.md` | Handoff protocol details |
| `standards/ORGANIZATION.md` | File/folder size thresholds, canonical hierarchy, refactoring triggers — read before every task |
| `standards/SLASH_COMMAND_CHECKLIST.md` | Required touchpoints when adding a new `/` block type (includes AI prompt sync) |
| `standards/UI_UX_GUIDELINES.md` | Source of truth for all design tokens, components, and interaction patterns |
