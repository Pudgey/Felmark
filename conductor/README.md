# Conductor — AI Project Operations System

A framework-agnostic project operations system for AI-assisted software development. Provides structured patterns for session continuity, multi-agent coordination, mission planning, and engineering standards.

## What This Is

Conductor is a self-sustaining knowledge system that runs alongside your codebase. It gives AI agents (Claude, Gemini, Codex, etc.) persistent context across sessions so they don't lose track of what's been done, what's in progress, and what's planned.

**It is NOT a framework.** It's a set of markdown files and conventions that AI agents read and write automatically.

## Quick Start

1. Clone or add as submodule to your project:
   ```bash
   # As a submodule
   git submodule add https://github.com/YOUR_ORG/conductor.git dev/conductor

   # Or just clone into your project
   git clone https://github.com/YOUR_ORG/conductor.git dev/conductor
   ```

2. Copy the templates into your conductor directory:
   ```bash
   cp templates/THOUGHTS.md .
   cp templates/HANDOFF.md .
   cp templates/ACTIVE_CONTEXT.md .
   cp templates/CONDUCTOR_HEALTH.md .
   cp templates/DEVELOPMENT_BRIEF.md .
   ```

3. Add the conductor brain rules to your project's `CLAUDE.md` (or equivalent AI config):
   ```markdown
   ## Conductor Brain (Self-Sustaining)
   - On session start: Read HANDOFF.md, check THOUGHTS.md for stale entries
   - During work: Update THOUGHTS.md with active task status
   - On session close: Write journal entry, update HANDOFF.md
   - After creating standards/skills/missions: Run health check
   ```

4. Add project-specific standards, skills, and missions as needed.

## Directory Structure

```
conductor/
├── THOUGHTS.md              ← Real-time agent scratchpad
├── HANDOFF.md               ← Context for the next session
├── ACTIVE_CONTEXT.md        ← Current project status snapshot
├── CONDUCTOR_HEALTH.md      ← Self-audit checklist
├── DEVELOPMENT_BRIEF.md     ← Master index of all planned work
├── agent-team/              ← Multi-agent coordination
│   ├── AGENT_TEAM.md        ← Roles, collision prevention
│   └── agent-sprint/        ← Sprint boards, atomic claims
│       └── SPRINT_SOP.md
├── journal/                 ← Session logs (auto-captured)
│   ├── README.md            ← Journal template
│   └── INDEX.md             ← Tag index
├── missions/                ← Feature plans (scoped work units)
├── standards/               ← Engineering SOPs (project-specific)
├── skills/                  ← Reusable agent skill definitions
├── sops/                    ← Framework-agnostic operating procedures
├── swarm/                   ← Multi-agent swarm specs
├── tracks/                  ← Roadmap and milestone tracking
└── templates/               ← Starter templates for all doc types
```

## Core Concepts

### Thoughts (Real-Time Status)
`THOUGHTS.md` is a scratchpad showing what each agent is doing right now. One sentence per task. Stale entries (>4 hours) get cleaned up on next session start.

### Handoff (Session Continuity)
`HANDOFF.md` is written at session close with in-progress work, gotchas, and remaining tasks. The next session reads it to pick up where you left off.

### Missions (Scoped Work)
Each feature or initiative gets a mission doc with: goal, deliverables, constraints, affected files, and standards to follow. Missions link to milestones.

### Standards (Engineering SOPs)
Project-specific engineering rules. These are where you put your framework-specific patterns (React hooks conventions, Flutter dispose rules, Go error handling, etc.).

### Skills (Agent Capabilities)
Reusable prompt templates that agents execute. Some are framework-agnostic (mission planning, debugging, code review). Others are project-specific (deployment, wiring, testing).

### Development Brief (Master Plan)
Single source of truth for all planned work across milestones, missions, and ideas. Auto-maintained by agents.

## Framework-Agnostic Skills (Included)

| Skill | Purpose |
|-------|---------|
| `mission` | Plan and scope new features |
| `swarm` | Multi-agent workflow with spec writing |
| `sprint` | Multi-agent sprint coordination |
| `brain` | Load full project context before coding |
| `find` | Read-only codebase sweep for issues |
| `review` | Systematic code review protocol |
| `debug` | Parallel hypothesis debugging |
| `aas` | Three-layer quality review |
| `empty` | Audit for missing loading/empty/error states |
| `flow` | End-to-end user journey audit |
| `optimize` | Multi-mode strategy engine |

## Adding Project-Specific Content

The conductor template gives you the patterns. You add:

1. **Standards** — Your framework's rules (e.g., `standards/REACT_PATTERNS.md`, `standards/GO_ERROR_HANDLING.md`)
2. **Skills** — Framework-specific skills (e.g., `skills/test/SKILL.md` for your test runner)
3. **Missions** — Your feature plans
4. **Journal entries** — Auto-captured by agents during sessions

## Multi-Project Usage

Each project gets its own conductor instance with shared patterns but project-specific content:

```
project-a/
└── dev/conductor/     ← conductor-template + React standards + project-a missions

project-b/
└── dev/conductor/     ← conductor-template + Flutter standards + project-b missions
```

The template repo stays clean. Project-specific content lives in each project's conductor directory.

## License

MIT
