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
| codex-main | Fix the workspace pane header regression where the black active rule shows but the surface dropdown no longer opens. | 2026-04-04 05:08 EDT | ACTIVE |

## Recent

| Agent | Task | Completed |
|-------|------|-----------|
| codex-main | Split the workspace pane shell into core tabs, layout, and surface modules in worktree `codex-workspace-core-restructure` and closed the old SplitPanes hotspot. | 2026-04-04 04:28 EDT |
| codex-main | Drafted the workspace core restructure mission and registered it in the development brief. | 2026-04-04 03:07 EDT |
| claude-main | Executed 3 super-brain follow-ups: repaired workstation MANIFEST, moved split lookups upstream, extracted hydration + resize + modals from page.tsx (509 → 378 lines). | 2026-04-03 |
| codex-main | Tightened the root agent instruction docs to emphasize disciplined code over superficial brevity. | 2026-04-03 16:05 EDT |
| codex-main | Benchmarked the Workstation surface against strong Next.js and React repos to extract only the patterns worth applying. | 2026-04-03 15:46 EDT |
