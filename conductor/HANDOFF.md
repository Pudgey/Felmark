# Session Handoff — 2026-04-03

## What happened
Rail icon refresh + Codex skill discovery fix.

### Completed
1. **Workstation icon** — Replaced generic monitor icon with anvil SVG in Rail.tsx. Added strike-spark animation on hover/active.
2. **Workspace icon** — Restructured planet SVG with orbit `<g>` group. Added spin animation + opacity pulse on hover/active (triggers on full button area, not just SVG).
3. **Codex skills fix** — Renamed all 29 `.agents/skills/*/AGENT.md` → `SKILL.md` so Codex CLI discovers them in the `$` menu.
4. **AGENTS.md update** — Added 4 missing skills (superbrain, deep-debug, diagnose, forge) to the skills table.
5. **CLAUDE.md sync** — Updated skill format references to match new `SKILL.md` naming.

## In-progress work
None.

## Remaining work
- [ ] Rebuild `FORGE_MAP.md` (stale — reports 174 files vs ~325 actual)
- [ ] Rebuild Settings page
- [ ] Verify TerminalWelcome split pane in browser
- [ ] Split `useBlockOperations.ts` on next touch (watch item — 346 lines, 7 concerns)
- [ ] Split `types.ts` by block family on next touch (watch item — 735 lines, 89 exports)

## Gotchas
- `Canvas.tsx` is at 726 lines (YELLOW). The remaining bulk is render JSX.
- `npm run lint` passes clean. Do not add eslint-disable comments without a concrete reason.
- `types.ts` is still 735 lines / 89 exports — next type hub to watch.
- EditorSidebar.tsx has user-added props (`onSelectWorkstation`, `onDuplicateProject`, `onArchiveProject`, `archived`, `onRestoreProject`) — preserve these on any future touch.
- Rail icon animations use CSS module classes (`.orbit`, `.planetBody`, `.spark`, `.planetIcon`, `.anvilIcon`) — if touching Rail.tsx or Rail.module.css, preserve these.
