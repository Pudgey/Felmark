# 2026-04-01 — Major Codebase Restructure

**Tags**: restructure, organization, architecture, views, workstation, editor, blocks

## Summary
Full session dedicated to codebase organization. No features built — pure structural cleanup to set the foundation for scale.

## Changes
- Deleted settings component for fresh rebuild
- Renamed workspace-page → workspace, WorkstationHome → Workstation
- Extracted 12 rail views from Editor.tsx into views/ layer (ViewRouter + per-view wrappers)
- Nested all workstation features under components/workstation/
- Reorganized editor into blocks/ (41 folders), chrome/ (7), panels/ (3)
- Unbundled 4 multi-block files into 27 individual block components
- Added organization standard (CLAUDE.md, AGENTS.md, conductor/standards/ORGANIZATION.md)

## Patterns Observed
- **God component syndrome**: Editor.tsx was rendering 12+ unrelated views. Extracted to views/ layer.
- **Bundle file anti-pattern**: 4 files contained 5-9 components each. Split into individual folders.
- **Flat folder chaos**: 25+ siblings at editor/ level with no grouping. Organized into blocks/, chrome/, panels/.
- **Naming drift**: WorkspacePage, WorkstationHome, workspace-page — inconsistent naming cleaned up.

## Decisions
- Views layer uses individual wrapper files (not one big router) so AI can edit one view without loading 13 others
- Cross-cutting components (comments, activity, history, notifications, terminal) stay top-level, not nested under workstation
- Organization standard uses hard numeric thresholds (500/800 lines, 10/15 folders) to make enforcement unambiguous

## Open Items
- Editor.tsx still at 1744 lines (red threshold)
- Workspace.tsx at 546 lines (yellow threshold)
- GUARDRAIL.md and FORGE_MAP.md need rebuild
- Settings page ready for fresh build
