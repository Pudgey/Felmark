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
| codex-main | Promoted the editor terminal into its own dedicated top-right action so it no longer feels buried inside split view | 2026-03-31 10:04 EDT |
| codex-main | Fixed Forge Paper so slash-created text blocks and the shared outline behave correctly on the live paper surface | 2026-03-31 09:58 EDT |
| codex-main | Audited Forge Paper so the text block pipeline and shared outline behavior explain why blocks fail to render or register | 2026-03-31 09:47 EDT |
| codex-main | Polished The Wire so its signal list, favorite state, and panel layout feel intentional instead of overlapping or visually breaking under interaction | 2026-03-31 09:27 EDT |
| codex-main | Tightened the workspace footer so the save timestamp stays compact instead of shoving the project and client summary around | 2026-03-31 09:16 EDT |
