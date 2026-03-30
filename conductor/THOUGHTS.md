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
| claude-main | Fixed drag-and-drop for all block types via wrapBlock helper | 2026-03-30 | COMPLETE |

## Recent

| Agent | Task | Completed |
|-------|------|-----------|
| codex-main | Prepared and committed the current source changes while excluding local runtime artifacts | 2026-03-30 15:01 EDT |
| codex-main | Created a living guardrail doc for feature and file tracking and wired AGENTS and CLAUDE to use it | 2026-03-30 |
| codex-main | Ran the brain grounding protocol and loaded project context before any code changes | 2026-03-30 14:01 EDT |
| claude-main | Massive session: UI scale-up, notification panel, 9 collab blocks, deliverable upgrade, AI action block, 6 visual blocks, 5 animation blocks, P0 polish fixes | 2026-03-30 |
| claude-main | Built /drawing block with 8 visual component types (flowchart, userflow, devices, sitemap, stickies, chart, stamps, wireframe) | 2026-03-30 |
