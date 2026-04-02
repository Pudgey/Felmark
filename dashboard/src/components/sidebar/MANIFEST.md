# Sidebar -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `Sidebar` -- default export from `Sidebar.tsx` (navigation sidebar: workstation/project tree, calendar view)
- `EditorSidebar` -- default export from `EditorSidebar.tsx` (document-editing sidebar: outline, progress, doc list)
- `CalendarView` -- default export from `CalendarView.tsx` (calendar with deadline map, used by Sidebar)

## Dependencies
- `@/lib/constants` -- STATUS
- `@/lib/types` -- Workstation, Project, ArchivedProject, Tab, Block
- `@/lib/due-dates` -- getDueLabel, getDueColor

## Imported By
- `app/page.tsx` -- conditionally renders Sidebar (navigation) or EditorSidebar (editing) based on active tab state

## Files
- `Sidebar.tsx` + `Sidebar.module.css` -- navigation sidebar (workstation tree, search, pinned, archive)
- `EditorSidebar.tsx` + `EditorSidebar.module.css` -- editor sidebar (doc indicator, outline, progress, terminal)
- `CalendarView.tsx` -- calendar component extracted from Sidebar, uses Sidebar.module.css for styling
- `MANIFEST.md` -- this file
