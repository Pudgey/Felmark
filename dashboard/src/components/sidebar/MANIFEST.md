# Sidebar -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `Sidebar` -- default export from `Sidebar.tsx` (client/project navigation tree)
- `WorkstationSidebar` -- default export from `WorkstationSidebar.tsx` (active workstation command center)

## Dependencies
- `@/lib/constants` -- STATUS
- `@/lib/types` -- Workstation, Project, ArchivedProject, Tab

## Imported By
- `app/page.tsx` -- conditionally renders Sidebar or WorkstationSidebar based on activeWorkstationId

## Files
- `Sidebar.tsx` + `Sidebar.module.css` -- original sidebar (workstation/project tree)
- `WorkstationSidebar.tsx` + `WorkstationSidebar.module.css` -- V2 workstation sidebar (command center)
- `MANIFEST.md` -- this file
