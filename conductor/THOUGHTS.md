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
| codex-main | Fixed the canvas duplicate-key bug by repairing element ids and syncing canvas id allocation to persisted elements. | 2026-04-04 08:34 EDT |
| codex-main | Grounding the session with the brain protocol before any scoped implementation work. | 2026-04-04 15:43 EDT |
| codex-main | Removed the focused-pane gradient seam under the workspace pane header. | 2026-04-04 06:02 EDT |
| codex-main | Implemented the pane polish kit for header chrome, Signals cards, and Work rows using the provided JSX as the spec. | 2026-04-04 05:57 EDT |
| codex-main | Replaced the pane color experiment with the provided dark-chrome header spec: icon tint by default, active seam, and optional tinted headers. | 2026-04-04 05:38 EDT |
