# hooks/

## What
Custom hooks extracted from Editor.tsx monolith. Each hook manages one concern.

## Exports
- `useFocusManager` -- block ref registry, scroll, focus with retry
- `useContentCache` -- content cache, save state, word counts, flush logic
- `useUndoStack` -- undo/redo with timed auto-dismiss
- `useBlockOperations` -- blocks state, CRUD, enter/backspace, drag/drop, AI generate
- `useSlashMenu` -- slash menu state, block insertion, graph/money pickers
- `useTabOverflow` -- tab overflow detection, visible/hidden tab computation
- `usePanelState` -- all panel open/close state, notifications, command palette
- `useEditorKeys` -- global keyboard shortcuts (Cmd+K, Cmd+Shift+Backspace, Escape)

## Dependencies
- `@/lib/types`
- `@/lib/utils`
- `../components/block-registry/blockDefaults` (CONTENT_DEFAULTS)
- `../../blocks/*` (default data factories)
- `../../../../activity/ActivityMargin` (BlockActivity type)
- `../../../../notifications/NotificationPanel` (Notification type)

## Imported By
- `../EditorCore.tsx`

## Files
- `useFocusManager.ts`
- `useContentCache.ts`
- `useUndoStack.ts`
- `useBlockOperations.ts`
- `useSlashMenu.ts`
- `useTabOverflow.ts`
- `usePanelState.ts`
- `useEditorKeys.ts`

## Rules
- Each hook manages exactly one concern.
- Hooks communicate through parameters, not shared state.
- New editor state belongs in the most specific hook, not in EditorCore.
