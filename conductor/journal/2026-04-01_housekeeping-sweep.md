# Journal: Housekeeping Sweep & Skill Sync

**Date**: 2026-04-01
**Agent**: claude-main
**Tags**: housekeeping, cleanup, skills, codex, conductor

## Context
Full codebase housekeeping sweep followed by Codex skill sync to match Claude skills.

## Discovery
- `data-chips` block appeared orphaned (no imports in Editor.tsx or constants.ts) but was actually imported by `forge/services/blocks/content.ts`. The forge service layer has its own import graph for block defaults — must check it before declaring blocks dead.
- 26 stale worktrees were consuming 5.2 GB. The `.claude/worktrees/` directory grows silently and should be pruned regularly.
- GUARDRAIL.md reported ~47.9K lines but actual post-restructure count is ~19.9K. The restructure unbundled mega-files but didn't increase total code — the old count may have included duplicates or the `.next` cache.
- Codex had `debug` and `phase` skills not in Claude; Claude had `diagnose`, `forge`, `superbrain` not in Codex. `debug` = `diagnose` (same content, different name).

## What Worked
- Five-pass scan approach (artifacts, prototypes, conductor, dead files, broken imports) caught issues systematically.
- Parallel file count + reference checks made orphan detection fast.

## What Didn't Work
- Deleted `data-chips` block without checking the forge service layer — caused a build error. Need to grep ALL of `dashboard/src/`, not just Editor.tsx and constants.ts, before declaring anything dead.

## Future Guidance
- When checking if a block is dead, search the entire `dashboard/src/` tree, not just the known hotspots. The forge service layer imports block defaults independently.
- Worktree pruning should be part of every housekeeping sweep — they accumulate fast with agent sprints.
- FORGE_MAP.md is still stale and needs a `/forge` rebuild next session.
- TerminalWelcome removal was approved but not yet executed — pending decision on what replaces it in ViewRouter's no-tab fallback.
