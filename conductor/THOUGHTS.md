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
| codex-main | Restored the editor gutter controls in split-terminal mode and added the missing delete X to regular document blocks | 2026-03-31 01:54 EDT |
| codex-main | Added drag-and-drop tab reordering in the editor tab strip with visible drop cues and persisted tab order | 2026-03-31 01:39 EDT |
| codex-main | Replaced the Wire route’s retired Anthropic model defaults with current supported ids so runs no longer fail with model not found | 2026-03-31 01:31 EDT |
| codex-main | Refined the Wire flow close control into a simple X anchored on the card instead of a detached shell button | 2026-03-31 01:14 EDT |
| codex-main | Added a close path to the reopened Wire signal flow with a visible close control and Escape support back to the feed | 2026-03-31 01:07 EDT |
