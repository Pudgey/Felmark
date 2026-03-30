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
| | | | |

## Recent

| Agent | Task | Completed |
|-------|------|-----------|
| claude-main | Added stencil library (40+ stencils, 8 categories) and production-ready canvas interactions (multi-select, drag-move, rubber band, keyboard shortcuts, z-order) | 2026-03-30 |
| codex-main | Fixed slash-menu ranking so queries prefer relevant block names and removed the stale reset effect from the menu | 2026-03-30 16:46 EDT |
| codex-main | Fixed the templates card highlight so hover and selected states both show the outline immediately | 2026-03-30 16:27 EDT |
| codex-main | Hardened the share modal with visible API errors and a manual-copy fallback for blocked clipboard access | 2026-03-30 16:17 EDT |
| codex-main | Audited the dashboard for micro-polish gaps in small interactions, feedback loops, and dead-end controls | 2026-03-30 16:09 EDT |
