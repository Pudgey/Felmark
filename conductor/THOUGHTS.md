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
| codex-main | Committing and pushing the current publishable worktree while excluding local runtime artifacts | 2026-03-30 10:54 EDT | ACTIVE |

## Recent

| Agent | Task | Completed |
|-------|------|-----------|
| codex-main | Removed stale Flutter and INDEP references from the shared skill library and rewrote it for Felmark | 2026-03-30 |
| codex-main | Reviewed Claude skill protocols and adopted the usable command set for this repo | 2026-03-30 |
| claude-main | Massive feature sprint: graph blocks, money blocks, deadline blocks, @date chips, block deletion, date pickers, personal workspace, services/templates icons, outline drag-reorder, competitive intel | 2026-03-30 |
| claude-main | Sprint: Wire Workspace Home — T-001 through T-005 | 2026-03-29 |
| claude-main | MISSION_CONVERSATIONS_V2 — all 5 deliverables complete | 2026-03-29 |
