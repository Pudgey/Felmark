# views/

View routing layer. Each file wires a single rail destination to its component with the props it needs. ViewRouter maps `railActive` to the correct view.

## Exports

| File | Component | Props |
|------|-----------|-------|
| `ViewRouter.tsx` | `ViewRouter` | Full `ViewRouterProps` — receives all state from page.tsx |
| `calendar.tsx` | `CalendarView` | workstations, onOpenProject, scrollToProjectId, onScrollComplete |
| `search.tsx` | `SearchView` | workstations |
| `services.tsx` | `ServicesView` | none |
| `pipeline.tsx` | `PipelineView` | none |
| `templates.tsx` | `TemplatesView` | none |
| `finance.tsx` | `FinanceView` | none |
| `wire.tsx` | `WireView` | workstations |
| `team.tsx` | `TeamView` | none |
| `home.tsx` | `HomeView` | workstations, overdueCount, onSelectWorkstation, onSelectProject, onNewTabInWorkstation, onNewWorkstation |
| `forge.tsx` | `ForgeView` | tabs, activeBlocks, activeProject, workstations, onClose, onSave |
| `workstation.tsx` | `WorkstationView` | workstations, activeWorkstationId, onSelectProject, onNewTab, onRenameWorkstation, onUpdateProjectDue |
| `terminal-welcome.tsx` | `TerminalWelcomeView` | workstations, overdueCount, onNewWorkstation |
| `editor.tsx` | `EditorView` | Full editor props (31 fields) — see file for interface |
| `workspace.tsx` | `WorkspaceView` | none (renders Canvas from `workspace/canvas/`) |

## Dependencies

- `@/lib/types` — shared type definitions
- `@/lib/initial-services` — WIRE_SERVICES constant (wire.tsx only)
- `@/components/*` — each view imports its underlying component

## Imported By

| File | What |
|------|------|
| `app/page.tsx` | `ViewRouter` |

## Routed Shell Contract

`ViewRouter.tsx` owns the routed shell sizing contract. Its wrapper must provide the full available surface to each routed screen:

- `flex: 1`
- `display: flex`
- `min-width: 0`
- `min-height: 0`

Each routed view root must also claim that shell explicitly. If a view renders its own top-level container, that root should opt into the same contract with full-width/full-height flex sizing instead of relying on content width or intrinsic height.

## Planned Guardrail Refactor

Status: Planned, not implemented.

1. Extract the routed-shell wrapper into a shared `RoutedViewShell` helper or a single shared CSS contract in `views/`.
2. Update every routed view root to consume that shared shell contract instead of defining ad hoc inline sizing.
3. Extend the new-view checklist below so every new rail view explicitly opts into the shared shell contract.
4. Add a lightweight visual smoke check for `home`, `workspace`, and workstation-home so full-height/full-width regressions surface before manual QA.

## Adding a new rail view

1. Create `views/<name>.tsx` with a `<Name>View` component
2. Add a `case "<name>"` in `ViewRouter.tsx`'s switch
3. Add any new props needed to `ViewRouterProps`
4. Pass those props from `page.tsx` → `ViewRouter`
5. Make the view root opt into the routed shell contract above
6. Update this manifest
