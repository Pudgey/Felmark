# Thoughts — Real-Time Agent Scratchpad

> **Version**: 1.0

**Purpose**: One-sentence, real-time visibility into what each agent/session is doing. Not a report — that's what the journal is for.

## Rules

1. **On task start**: Add a row to Current with status `ACTIVE` and a timestamp.
2. **On task complete**: Update status to `COMPLETE`.
3. **After marking complete**: Update journal, ACTIVE_CONTEXT, and any other affected conductor files. Then move the entry to Recent.
4. **One sentence max** per task. Detail goes in the journal, not here. Write it in plain English — no jargon, no internal code names.
5. **Stale detection**: Any `ACTIVE` entry older than 4 hours is suspect. Next session must resolve or clear it during health check.
6. **Recent cap**: Keep only the last 5 entries. When adding a 6th, drop the oldest.
7. **Agent naming**: Teams use agent names (architect, data-hawk). Solo sessions use `claude-main`.

## Current

| Agent | Task | Started | Status |
|-------|------|---------|--------|
| — | — | — | — |

## Recent

| Agent | Task | Completed |
|-------|------|-----------|
| claude-main | Slop remediation: collapsed page.tsx wrappers, extracted Canvas hooks, extracted persistence + shell hooks from page.tsx, fixed GraphDataEditor stale-closure bug | 2026-04-03 00:15 EDT |
| claude-main | Added quality gate scripts (lint strict, typecheck, check) + CI workflow + cleaned entire 99-problem lint baseline to zero | 2026-04-02 17:55 EDT |
| codex-main | Defining a redesign skill that forces prototype scan, deep requirement questioning, and a full plan before implementation | 2026-04-02 13:20 EDT |
| codex-main | Gave workstation blocks subtler edit identities so metric, chat, and utility blocks read differently without adding noise | 2026-04-02 04:49 EDT |
| codex-main | Reduced workstation canvas border, chrome, and insertion noise so only one editing layer is visually leading at a time | 2026-04-02 04:49 EDT |
