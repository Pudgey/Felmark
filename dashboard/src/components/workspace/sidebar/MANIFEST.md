# Workspace Sidebar — MANIFEST

## Exports
- `WorkspaceSidebar` — default export, client navigation sidebar

## Dependencies
- `@/views/routers/WorkspaceRouter` — useWorkspaceNav (for hub navigation and global dismiss)

## Imported By
- `views/routers/WorkspaceRouter.tsx`

## Files
- `WorkspaceSidebar.tsx` — Component with client cards, search (live filtering), sparklines, health rings
- `WorkspaceSidebar.module.css` — All sidebar styles
- `MANIFEST.md` — This file

## Notes
- Search input filters CLIENTS (by name + task title) and SIGNALS (by text) in real-time
- Section counts (`CLIENTS.length`, `SIGNALS.length`) always show total, not filtered count
