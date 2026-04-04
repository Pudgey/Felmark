# views/

View routing layer. `ViewRouter.tsx` is a tiny domain classifier that delegates to three sub-routers in `routers/`. Each view file wires a single rail destination to its component with the props it needs.

## Architecture

```
ViewRouter.tsx (30 lines) -- domain classifier
  -> routers/WorkstationRouter.tsx -- editor + forge
  -> routers/DashboardRouter.tsx   -- home, calendar, search, etc.
  -> routers/WorkspaceRouter.tsx   -- canvas workspace
```

## Exports

| File | Component | Props |
|------|-----------|-------|
| `ViewRouter.tsx` | `ViewRouter` | `railActive`, `workstationProps`, `dashboardProps` |
| `calendar.tsx` | `CalendarView` | workstations, onOpenProject, scrollToProjectId, onScrollComplete |
| `search.tsx` | `SearchView` | workstations |
| `services.tsx` | `ServicesView` | none |
| `templates.tsx` | `TemplatesView` | none |
| `wire.tsx` | `WireView` | workstations |
| `team.tsx` | `TeamView` | none |
| `home.tsx` | `HomeView` | workstations, overdueCount, onSelectWorkstation, onSelectProject, onNewTabInWorkstation, onNewWorkstation |
| `forge.tsx` | `ForgeView` | tabs, activeBlocks, activeProject, workstations, onClose, onSave |
| `editor.tsx` | `EditorView` | Full editor props (31 fields) -- see file for interface |

## Subfolders

| Folder | Purpose |
|--------|---------|
| `routers/` | Domain sub-routers -- see `routers/MANIFEST.md` |

## Dependencies

- `@/lib/types` -- shared type definitions
- `@/lib/initial-services` -- WIRE_SERVICES constant (wire.tsx only)
- `@/components/*` -- each view imports its underlying component

## Imported By

| File | What |
|------|------|
| `app/page.tsx` | `ViewRouter` |

## Routed Shell Contract

Each sub-router wraps its content in a flex container:

- `flex: 1`
- `display: flex`
- `min-width: 0`
- `min-height: 0`

Each routed view root must also claim that shell explicitly.

## Adding a new rail view

1. Create `views/<name>.tsx` with a `<Name>View` component
2. Determine the domain: workstation, dashboard, or workspace
3. Add a `case "<name>"` in the appropriate sub-router (`routers/DashboardRouter.tsx` for most new views)
4. Add any new props to the sub-router's props interface
5. Pass those props from `page.tsx` -> `ViewRouter` -> sub-router via the appropriate bundle
6. Make the view root opt into the routed shell contract above
7. Update this manifest and `routers/MANIFEST.md`
