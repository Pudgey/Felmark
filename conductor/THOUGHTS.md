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
| codex-main | Tightened the editor margin rail spacing and made the focus marker ignore pointer events so the gutter hover stays usable | 2026-03-30 18:21 EDT |
| codex-main | Moved the editor active-block highlight out of the text plane and into a cleaner margin rail cue | 2026-03-30 18:18 EDT |
| codex-main | Implemented the first editor polish pack with save feedback, active/new block cues, undo, and slash-menu match highlighting | 2026-03-30 18:11 EDT |
| claude-main | Added stencil library (40+ stencils, 8 categories) and production-ready canvas interactions (multi-select, drag-move, rubber band, keyboard shortcuts, z-order) | 2026-03-30 |
| codex-main | Fixed slash-menu ranking so queries prefer relevant block names and removed the stale reset effect from the menu | 2026-03-30 16:46 EDT |
