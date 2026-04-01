# components/

## What
UI components extracted from Editor.tsx return statement. Each renders one visual section.

## Components
- `tab-bar/TabBar` -- tab zone with visible tabs, overflow pill, sidebar toggle, convo button
- `toolbar/Toolbar` -- right-side action buttons (terminal, split, notifications, comments, history, share, profile)
- `toolbar/split-picker/SplitPicker` -- split view project picker dropdown
- `breadcrumb/Breadcrumb` -- navigation breadcrumb with status badge and breathe toggle
- `document-surface/DocumentSurface` -- editor scroll area with meta bar, block list, slash menu, format bar
- `block-renderer/BlockRenderer` -- per-block rendering: gutter, type dispatch, comment button, drag handlers
- `block-registry/` -- block component imports, default data, content block map
- `zen-hint/ZenHint` -- zen mode exit overlay

## Imported By
- `../EditorCore.tsx`

## Rules
- Components receive all data via props, no direct hook calls except local UI state.
- CSS modules are co-located with their component.
- New visual sections go here, not inline in EditorCore.
