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
| codex-main | Normalized the remaining special editor block gutters so e-signature, AI, and other structured blocks now expose the same delete X as standard rows | 2026-03-31 06:15 EDT |
| codex-main | Realigned the split-terminal editor gutter so project chrome and block cards keep the same left edge under responsive compression | 2026-03-31 06:08 EDT |
| codex-main | Wired the outline jump target to real editor rows so every block type now scrolls correctly from the left margin | 2026-03-31 06:00 EDT |
| codex-main | Updated the editor outline to recognize newer block types and show real previews instead of empty placeholders | 2026-03-31 05:49 EDT |
| codex-main | Restored the editor gutter controls in split-terminal mode and added the missing delete X to regular document blocks | 2026-03-31 01:54 EDT |
