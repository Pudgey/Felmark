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
| claude-main | Housekeeping sweep — pruning worktrees, dead blocks, stale conductor docs | 2026-04-01 | COMPLETE |

## Recent

| Agent | Task | Completed |
|-------|------|-----------|
| codex-main | Ran brain grounding protocol and prepared execution constraints for the next task | 2026-04-01 09:59 EDT |
| codex-main | Debugged settings page — cleared stale entry from prior session | 2026-04-01 01:02 EDT |
| codex-main | Routed Settings to a dedicated page-level surface | 2026-04-01 00:31 EDT |
| claude-main | Major codebase restructure — views layer, workstation nesting, editor internals | 2026-04-01 |
| claude-main | Built Workspace v4 — standalone surface with right panel, timer, chat, invoice | 2026-04-01 00:30 EDT |
