# Mission: Workspace Core Restructure

**Created**: 2026-04-04
**Status**: Active
**Milestone**: M1

---

## Goal

Make the Workspace surface easier to extend by separating tab chrome, pane layout, and pane surface rendering without changing user-facing behavior.

---

## Scope

### Deliverables
- [x] Extract `HybridHeader` from `dashboard/src/components/workspace/panes/SplitPanes.tsx` into a first-class workspace chrome component at `dashboard/src/components/workspace/core/tabs/WorkspaceTabs.tsx` with dedicated styles and a folder `MANIFEST.md`.
- [x] Extract the split-pane sizing and orchestration logic into `dashboard/src/components/workspace/core/layout/PaneLayout.tsx` so the layout layer owns pane mechanics only, not workspace chrome or pane content.
- [x] Move the seven inlined pane surfaces out of `SplitPanes.tsx` into dedicated `dashboard/src/components/workspace/core/surfaces/*Pane.tsx` files so each surface is independently editable.
- [x] Replace `dashboard/src/components/workspace/panes/SplitPanes.module.css` with smaller CSS modules across `core/tabs/`, `core/layout/`, and `core/surfaces/` so no single workspace CSS file remains a red-hotspot monolith.
- [x] Update workspace imports, manifests, and compatibility seams so `dashboard/src/views/routers/WorkspaceRouter.tsx` consumes the new structure cleanly, and add missing `MANIFEST.md` files for `hub/`, `newtab/`, `products/`, and `toasts/`.

### Out of Scope
- Rewriting `WorkspaceSidebar.tsx` or redesigning the sidebar visual system.
- Adding new product behavior to Money, Work, Signals, Pipeline, Finance, Clients, or Time surfaces.
- Real data wiring, route changes outside the existing workspace router, or broader workspace feature expansion.
- A broad cleanup pass on `Workspace.tsx` beyond any minimal integration work required by the new pane architecture.

---

## Constraints

- Preserve existing workspace behavior in this pass: tab switching, pane resizing, visible surface content, and current routing should work the same after the refactor.
- Use a git worktree before touching `dashboard/src`, and checkpoint at logical boundaries because this concern will exceed the 5-file rule.
- Do not add packages, broaden the refactor into sidebar/product redesign, or leave duplicate pane implementations in both the old and new locations.
- Any new or repurposed workspace folder must ship with `MANIFEST.md`, and existing manifests must be updated if exports, dependencies, or importers change.

---

## Affected Files

### New Files
- `dashboard/src/components/workspace/core/MANIFEST.md`
- `dashboard/src/components/workspace/core/tabs/WorkspaceTabs.tsx`
- `dashboard/src/components/workspace/core/tabs/WorkspaceTabs.module.css`
- `dashboard/src/components/workspace/core/tabs/MANIFEST.md`
- `dashboard/src/components/workspace/core/layout/PaneLayout.tsx`
- `dashboard/src/components/workspace/core/layout/PaneLayout.module.css`
- `dashboard/src/components/workspace/core/layout/MANIFEST.md`
- `dashboard/src/components/workspace/core/surfaces/MoneyPane.tsx`
- `dashboard/src/components/workspace/core/surfaces/WorkPane.tsx`
- `dashboard/src/components/workspace/core/surfaces/SignalsPane.tsx`
- `dashboard/src/components/workspace/core/surfaces/PipelinePane.tsx`
- `dashboard/src/components/workspace/core/surfaces/TerminalPane.tsx`
- `dashboard/src/components/workspace/core/surfaces/ClientsPane.tsx`
- `dashboard/src/components/workspace/core/surfaces/TimePane.tsx`
- `dashboard/src/components/workspace/core/surfaces/MANIFEST.md`
- `dashboard/src/components/workspace/hub/MANIFEST.md`
- `dashboard/src/components/workspace/newtab/MANIFEST.md`
- `dashboard/src/components/workspace/products/MANIFEST.md`
- `dashboard/src/components/workspace/toasts/MANIFEST.md`

### Modified Files
- `dashboard/src/components/workspace/panes/SplitPanes.tsx` (source extraction, then intentional shim or retirement)
- `dashboard/src/components/workspace/panes/SplitPanes.module.css` (source extraction, then retirement or drastic shrink)
- `dashboard/src/views/routers/WorkspaceRouter.tsx` (swap imports to the new workspace core boundaries)
- `dashboard/src/components/workspace/MANIFEST.md` (update live architecture description and import graph)

### Dependencies (read-only)
- `dashboard/src/components/workspace/sidebar/WorkspaceSidebar.tsx` (layout contract and workspace chrome adjacency)
- `dashboard/src/components/workspace/sidebar/WorkspaceSidebar.module.css` (read for layout boundaries only; not a cleanup target in this mission)
- `dashboard/src/components/workspace/Workspace.tsx` (older workspace surface context and potential drift check)
- `dashboard/src/components/workspace/hub/ClientHub.tsx` (surface composition contract)
- `dashboard/src/components/workspace/newtab/NewTab.tsx` (surface composition contract)
- `dashboard/src/components/workspace/products/ProductsTab.tsx` (surface composition contract)
- `dashboard/src/components/workspace/toasts/Toasts.tsx` (workspace overlay integration)

---

## Standards to Follow

- [ ] `AGENTS.md` worktree, scope, and checkpoint rules
- [ ] `conductor/GUARDRAIL.md` feature inventory and manifest-update rules
- [ ] `conductor/skills/brain/PROTOCOL.md` read-before-write and importer review discipline

---

## Notes

Target structure for implementation:

```text
workspace/
  core/
    tabs/
    layout/
    surfaces/
  sidebar/
  hub/
  newtab/
  pipeline/
  finance/
  products/
  timer/
  toasts/
```

Execution note: the live split layout used `Terminal`, not `Finance`, so the extracted seventh pane is `TerminalPane.tsx`.

Implementation note: `panes/SplitPanes.tsx` remains as a short compatibility wrapper while the new `workspace/core/` path settles.
