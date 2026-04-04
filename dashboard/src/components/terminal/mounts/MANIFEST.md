# terminal/mounts/ -- MANIFEST

## Exports
- `SharedTerminalProvider` -- App-level shared session provider for the terminal
- `useSharedTerminal` -- Hook for the shared terminal session and environment
- `WorkstationTerminalMount` -- Editor-specific mount that enables ambient intelligence
- `WorkspaceTerminalMount` -- Workspace-specific mount that shares history without document ambient context

## Dependencies
- `../Terminal` -- terminal UI
- `../TerminalProvider` -- terminal runtime/controller
- `@/lib/terminal/session` -- persisted shared session model
- `@/lib/types` -- workstation/editor block types

## Imported By
- `app/page.tsx` -- wraps the app shell in `SharedTerminalProvider`
- `workstation/editor/core/EditorCore.tsx` -- renders `WorkstationTerminalMount` in the editor split pane
- `workspace/core/surfaces/TerminalPane.tsx` -- renders `WorkspaceTerminalMount` for the workspace terminal surface

## Files
- `SharedTerminalProvider.tsx` -- session context + localStorage persistence
- `WorkstationTerminalMount.tsx` -- workstation terminal bridge
- `WorkspaceTerminalMount.tsx` -- workspace terminal bridge
