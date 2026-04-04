# workspace/core/surfaces/ -- MANIFEST

## Exports
- `SURFACES` -- workspace pane metadata and picker definitions
- `SURFACE_CONTEXT` -- pane header context copy by surface
- `SURFACE_COMPONENTS` -- pane surface registry
- `getSurfaceMeta` -- surface metadata lookup
- `MoneyPane`, `WorkPane`, `SignalsPane`, `PipelinePane`, `ClientsPane`, `TimePane`, `TerminalPane`, `CalendarPane` -- workspace pane bodies

## Dependencies
- `@/views/routers/WorkspaceRouter` -- hub navigation from the work surface
- `@/components/terminal/mounts/WorkspaceTerminalMount` -- shared workspace terminal mount
- `@/components/calendar/CalendarFull` -- calendar week view component
- `@/lib/constants` -- INITIAL_WORKSTATIONS seed data for calendar

## Imported By
- `workspace/core/layout/Pane.tsx` -- renders pane bodies and surface metadata

## Files
- `registry.ts` -- surface metadata, labels, and component registry
- `MoneyPane.tsx` -- invoices, earnings, and payment state surface
- `WorkPane.tsx` -- task, timer, and client hub launch surface
- `SignalsPane.tsx` -- client activity feed surface
- `PipelinePane.tsx` -- deals and stage summary surface
- `ClientsPane.tsx` -- client list and health snapshot surface
- `TimePane.tsx` -- tracked time and value summary surface
- `TerminalPane.tsx` -- shared workspace terminal surface
- `CalendarPane.tsx` -- calendar week view surface
- `ListPane.module.css` -- shared styles for list-like workspace surfaces
- `SignalsPane.module.css` -- signal feed styles
- `MANIFEST.md` -- this file
