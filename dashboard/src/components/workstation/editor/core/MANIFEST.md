# core/

## What
Modular architecture for the block editor. Breaks the 1,779-line Editor.tsx monolith into hooks, components, and registries.

## Exports
- `EditorCore` (default) -- the skeleton component (~200 lines)
- `EditorProps` (type) -- the full props interface

## Dependencies
- `@/lib/types` (Block, Tab, Workstation, Project, etc.)
- `@/lib/utils` (uid, cursorTo)
- `@/lib/constants` (STATUS)
- `../../../terminal/mounts/WorkstationTerminalMount`
- `@/components/shared/DueDatePicker`
- `../blocks/*` (all block type components)
- `../chrome/*` (editable-block, slash-menu, format-bar, command-bar, command-palette, margin, split-pane)
- `../panels/*` (share-modal, conversation, cat)
- `../../../comments/CommentPanel`
- `../../../activity/ActivityMargin`
- `../../../history/HistoryModal`
- `../../../notifications/NotificationPanel`

## Imported By
- `editor/Editor.tsx` (re-export)

## Files
- `EditorCore.tsx` -- skeleton component
- `EditorCore.module.css` -- shell-level styles
- `components/` -- UI components (tab-bar, toolbar, breadcrumb, document-surface, block-renderer, block-registry, zen-hint)
- `hooks/` -- custom hooks (useFocusManager, useContentCache, useUndoStack, useBlockOperations, useSlashMenu, useTabOverflow, usePanelState, useEditorKeys)

## Rules
- EditorCore must stay under 250 lines. If it grows, extract into a new component.
- New block types go in block-registry, not in EditorCore.
- New panels go in usePanelState, not scattered across hooks.
