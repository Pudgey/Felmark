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
| codex-main | Separating vertical row cadence from column gutters so the workspace canvas reads with more intentional rhythm between bands | 2026-04-02 12:37 EDT | ACTIVE |

## Recent

| Agent | Task | Completed |
|-------|------|-----------|
| codex-main | Reworking the workstation editor margin into a true workstation control rail so it reflects docs, review, signals, and terminal state instead of only outline data | 2026-04-02 12:45 EDT |
| codex-main | Fixing the sidebar runtime crash caused by a leftover totalProjects reference after the forge summary wiring | 2026-04-02 12:03 EDT |
| codex-main | Building the first forge finance slice and sidebar projection so shell client summaries stop being surface-owned | 2026-04-02 11:53 EDT |
| codex-main | Proposed the next forge phase so sidebar, workspace, workstation, and finance can share owned truth without surface coupling | 2026-04-02 10:36 EDT |
| codex-main | Added the first forge domain structure manifests so shared client, finance, and surface read models can be designed without surface coupling | 2026-04-02 10:35 EDT |
