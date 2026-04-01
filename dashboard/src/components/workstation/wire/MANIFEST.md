# Wire -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `WirePage` -- Integration/automation hub connecting external services
- `WireSignalFlow` -- Visual signal flow diagram for wire connections
- `WireConfig` (type) -- wire configuration interface

## Dependencies
- `@/lib/types` -- Workspace
- `@/lib/wire-context` -- WireService
- `@/lib/initial-services` -- WIRE_SERVICES (imported by Editor.tsx)

## Imported By
- `Editor.tsx` -- WirePage rendered when wire view is active

## Files
- `WirePage.tsx` -- main page (319 lines)
- `WirePage.module.css` -- page styles
- `WireSignalFlow.tsx` -- signal flow visualization (582 lines)
- `WireSignalFlow.module.css` -- flow styles
