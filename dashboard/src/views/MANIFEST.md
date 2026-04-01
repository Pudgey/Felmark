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

## Adding a new rail view

1. Create `views/<name>.tsx` with a `<Name>View` component
2. Add a `case "<name>"` in `ViewRouter.tsx`'s switch
3. Add any new props needed to `ViewRouterProps`
4. Pass those props from `page.tsx` → `ViewRouter`
5. Update this manifest
