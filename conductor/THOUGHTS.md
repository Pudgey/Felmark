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
| codex-main | Debugged Forge rail navigation so clicking Forge restores a document context instead of switching the shell into a blank no-tab state | 2026-04-01 00:19 EDT |
| codex-main | Added AI slash-block support to Forge Paper so /ai inserts a real generation block and resolves into document blocks on the paper surface | 2026-03-31 12:28 EDT |
| codex-main | Debugged Forge Paper slash blocks so unsupported conversions stop failing invisibly on the paper surface | 2026-03-31 12:20 EDT |
| codex-main | Debugged Forge Paper outline behavior so text blocks register and navigate correctly instead of disappearing from the paper outline | 2026-03-31 10:12 EDT |
| codex-main | Promoted the editor terminal into its own dedicated top-right action so it no longer feels buried inside split view | 2026-03-31 10:04 EDT |
