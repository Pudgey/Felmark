# views/routers/ -- MANIFEST

Domain sub-routers. Each router owns one product surface and maps `railActive` to the correct view wrapper.

## Exports

| File | Component | Domain |
|------|-----------|--------|
| `WorkstationRouter.tsx` | `WorkstationRouter` | Editor + Forge Paper (`workstations`, `forge`) |
| `DashboardRouter.tsx` | `DashboardRouter` | Home, Calendar, Search, Pipeline, etc. |
| `WorkspaceRouter.tsx` | `WorkspaceRouter` | Canvas workspace |

## Dependencies

- `../editor`, `../forge` -- workstation views
- `../home`, `../calendar`, `../search`, `../services`, `../pipeline`, `../templates`, `../finance`, `../wire`, `../team` -- dashboard views
- `../workspace` -- workspace view
- `@/lib/types` -- Block, Workstation, Tab, Project, DocumentTemplate
- `@/components/comments/CommentPanel` -- Comment type
- `@/components/activity/ActivityMargin` -- BlockActivity type

## Imported By

| File | What |
|------|------|
| `views/ViewRouter.tsx` | All three routers |

## Notes

- `WorkstationRouter` exports `WorkstationRouterProps` interface
- `DashboardRouter` exports `DashboardRouterProps` interface
- All routers wrap their content in a flex div with `flex: 1, minWidth: 0, minHeight: 0, display: "flex"`
