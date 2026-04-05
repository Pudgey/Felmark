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

## Recent

| Agent | Task | Completed |
|-------|------|-----------|
| claude-main | Added cloud rail icon and replaced 380+ hardcoded colors across 15 workspace CSS files with theme-aware CSS variables. | 2026-04-05 |
| claude-main | Built workspace command palette (Cmd+K) and wired sidebar search filter across WorkspaceRouter, WorkspaceTabs, WorkspaceSidebar. | 2026-04-04 |
| claude-main | Rebuilt FORGE_MAP.md from live disk scan — workspace canvas grid gone, ForgePaper renamed to Paper, 4 drift items flagged. | 2026-04-04 |
| codex-main | Fixed the workstation editor footer so block counts and save status stay aligned on narrow widths. | 2026-04-04 11:07 EDT |
| codex-main | Renamed the standalone workstation image block so it is surfaced distinctly as Single Image beside Gallery. | 2026-04-04 10:20 EDT |
