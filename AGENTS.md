# AGENTS.md

This file provides guidance to OpenAI Codex CLI when working with code in this repository.

## Project Overview

Felmark (tryfelmark.com) is a browser-native freelancer operating system built as a Chrome extension. It starts as a notepad + client workspaces tool — capturing the frustrated 200K users of the broken "Notepad" extension — then expands into auto time tracking, invoicing, messaging, and a full web app. It is NOT a note-taking app. It's a freelancer tool that happens to start with notes.

## Build & Development Commands

```bash
npm install                # Install dependencies
npm run dev                # Development with hot reload
npm run build              # Production build
npm run lint               # Run linter
```

Chrome extension testing:
1. `chrome://extensions/` -> Enable Developer Mode
2. "Load unpacked" -> select the `dist/` (or build output) folder
3. Reload extension after changes

## Stack

### Web App (the actual product)
- React / Next.js
- Supabase (PostgreSQL + Auth + Realtime)
- Stripe Connect (invoicing)
- Vercel (hosting)

### Chrome Extension (thin shell)
- Manifest V3
- New tab override or popup redirect to `app.tryfelmark.com`
- ~50 lines of code total
- Future: content script for domain detection (auto time tracking)

### Project Structure
```
Felmark/
├── CLAUDE.md                      <- Claude Code instructions
├── AGENTS.md                      <- This file (Codex CLI instructions)
├── Prototype/
│   └── FreelancerPad.jsx          <- Block editor prototype (visual reference only)
├── business/                      <- Strategy docs, research, concepts
├── conductor/                     <- Project Operations Hub
│   ├── THOUGHTS.md                <- Real-time agent scratchpad
│   ├── HANDOFF.md                 <- Session continuity context
│   ├── ACTIVE_CONTEXT.md          <- Current project snapshot
│   ├── CONDUCTOR_HEALTH.md        <- Self-audit protocol
│   ├── DEVELOPMENT_BRIEF.md       <- Master plan: milestones, missions, strategy
│   ├── journal/                   <- Session journals
│   ├── missions/                  <- Feature mission docs
│   ├── skills/                    <- Skill definitions (agent-agnostic)
│   ├── sops/                      <- Standard operating procedures
│   └── templates/                 <- Doc templates
├── app/                           <- Web app (Next.js — to be created)
└── extension/                     <- Chrome extension shell (~50 lines)
```

## Architecture

**The extension is a thin shell. The app lives on the server.**

```
Chrome Extension (~50 lines)          Web App (app.tryfelmark.com)
┌─────────────────────────┐           ┌──────────────────────────┐
│ manifest.json           │           │ React dashboard          │
│ newtab.html (iframe) or │──iframe──>│ Auth (Supabase)          │
│ popup (redirect)        │   or      │ Database                 │
│                         │  redirect │ Stripe Connect           │
│ Zero business logic     │           │ All business logic       │
└─────────────────────────┘           └──────────────────────────┘
```

- Extension contains zero business logic — just a URL pointing to the web app
- Web app updates ship instantly without Chrome Web Store review cycles
- Same web app serves extension users AND direct visitors

### MVP Feature Set (Phase 1)
- Client workspaces (create, switch, organize by client)
- Notes per workspace (block editor, autosave, search)
- Dark mode (light / dark / system auto)
- Export (Markdown, plain text, JSON)
- Chrome extension shell (new tab override or toolbar popup)

### Pricing Model
- **Free**: 3 workspaces, local storage, basic features
- **Pro** ($12/mo): Unlimited workspaces, cloud sync, time tracking, invoicing
- **Team** ($8/user/mo): Shared workspaces, messaging, client portals

## Ground Rules

### 1. No Scope Creep
- **STOP -> PROPOSE -> WAIT** before expanding scope beyond the current task.

### 2. Hard Constraints
- Do NOT add or remove packages without explicit human approval.
- Do NOT modify more than 5 files per concern without checkpointing (commit).
- Run the project's linter after every file edit.
- Do NOT touch files outside the scope of the assigned task.
- Emergency abort: If modifying more than 10 files, changing dependencies, or fighting the linter with suppressions — STOP, commit what you have, and let the human decide.

### 3. Code Quality
- No unnecessary abstractions — three similar lines is better than a premature helper.
- Don't add features, refactor code, or make "improvements" beyond what was asked.
- Don't add error handling for scenarios that can't happen.
- Don't create helpers or utilities for one-time operations.
- Avoid backwards-compatibility hacks. If something is unused, delete it completely.

### 4. Conductor Integration

The Conductor is the project's self-sustaining knowledge system in `conductor/`. All agents (Claude, Codex, etc.) share the same conductor state.

#### On Session Start
- Read `conductor/HANDOFF.md` for context from the previous session.
- Read `conductor/ACTIVE_CONTEXT.md` for current project state.
- Check `conductor/THOUGHTS.md` for stale `ACTIVE` entries (older than 4 hours). Resolve or clear them.

#### During Work
- **On task start**: Add a row to `conductor/THOUGHTS.md` Current table with `ACTIVE` status, agent name `codex-main`, one-sentence task description, and timestamp.
- **On task complete**: Update status to `COMPLETE`, then move the entry to the Recent table (cap at 5, drop oldest).

#### On Session Close
After any non-trivial session:
1. Mark remaining `ACTIVE` entries in THOUGHTS.md as `COMPLETE` (or clear if abandoned).
2. Write a journal entry to `conductor/journal/YYYY-MM-DD_<slug>.md`.
3. Update `conductor/journal/INDEX.md` with the new entry's tags.
4. Regenerate `conductor/ACTIVE_CONTEXT.md` with current state.
5. Write `conductor/HANDOFF.md` if there's in-progress work or gotchas.

### 5. File Write Rule
When creating or saving `.md` files for the conductor (missions, standards, reports, audits, tracks, skills, strategy, design specs), **always write them to `conductor/`**.

## Skills

Skills are reusable protocols stored in `conductor/skills/<name>/SKILL.md`. They are agent-agnostic — both Claude Code and Codex can follow them. To invoke a skill, read the SKILL.md file and follow its instructions.

| Skill | Purpose | File |
|-------|---------|------|
| brain | Project grounding protocol — load full context before changes | `conductor/skills/brain/SKILL.md` |
| mission | Create a new feature mission plan | `conductor/skills/mission/SKILL.md` |
| review | Systematic code review checklist | `conductor/skills/review/SKILL.md` |
| debug | Parallel hypothesis debugging | `conductor/skills/debug/SKILL.md` |
| find | Read-only codebase sweep for bugs and issues | `conductor/skills/find/SKILL.md` |
| fix | Resolve a specific finding or bug | `conductor/skills/fix/SKILL.md` |
| refactor | Safe incremental refactor (one concern per pass) | `conductor/skills/refactor/SKILL.md` |
| aas | Three-layer quality review (Advocate/Adjudicate/Suitability) | `conductor/skills/aas/SKILL.md` |
| swarm | Goal-driven multi-agent decomposition | `conductor/skills/swarm/SKILL.md` |
| sprint | Agent team sprint coordination | `conductor/skills/sprint/SKILL.md` |
| optimize | Multi-mode strategy engine | `conductor/skills/optimize/SKILL.md` |
| export | Port prototype to production code | `conductor/skills/export/SKILL.md` |
| secure | Security audit | `conductor/skills/secure/SKILL.md` |
| a11y | Accessibility audit | `conductor/skills/a11y/SKILL.md` |
| flow | End-to-end user journey audit | `conductor/skills/flow/SKILL.md` |
| empty | Loading/empty/error state audit | `conductor/skills/empty/SKILL.md` |
| fallback | Resilience audit and hardening | `conductor/skills/fallback/SKILL.md` |
| tone | Microcopy and brand voice audit | `conductor/skills/tone/SKILL.md` |
| responsive | Responsive layout audit | `conductor/skills/responsive/SKILL.md` |
| micro | Micro-interaction audit | `conductor/skills/micro/SKILL.md` |
| polish | Pre-release polish checklist | `conductor/skills/polish/SKILL.md` |
| bruteforce | 5-agent adversarial codebase audit | `conductor/skills/bruteforce/SKILL.md` |
| housekeeping | Codebase cleanup sweep | `conductor/skills/housekeeping/SKILL.md` |
| sop | Production readiness orchestrator | `conductor/skills/sop/SKILL.md` |

### Invoking a Skill

When the user says something like "run brain" or "do a review on src/", read the corresponding SKILL.md and execute its protocol. Pass the user's target as the scope argument.

## Key Documents

| Document | Purpose |
|----------|---------|
| `conductor/DEVELOPMENT_BRIEF.md` | Master plan: milestones, missions, strategy |
| `conductor/ACTIVE_CONTEXT.md` | Current project snapshot |
| `conductor/THOUGHTS.md` | Real-time agent scratchpad |
| `conductor/HANDOFF.md` | Session continuity context |
| `conductor/CONDUCTOR_HEALTH.md` | Self-audit protocol |
| `conductor/agent-team/AGENT_TEAM.md` | Multi-agent coordination |
| `conductor/sops/AAS_SOP.md` | Three-layer quality review protocol |
| `conductor/sops/SESSION_HANDOFF.md` | Handoff protocol details |
