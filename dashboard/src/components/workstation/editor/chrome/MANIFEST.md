# chrome/ -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Purpose
Editor UI chrome -- toolbar components, menus, and structural elements that surround the block content area.

## Folders
- `command-bar/` -- Quick command input bar
- `command-palette/` -- Full command palette (Ctrl+K) with search
- `editable-block/` -- Wrapper for individual editable blocks
- `format-bar/` -- Floating text formatting toolbar
- `margin/` -- Editor margin (line numbers, block actions)
- `slash-menu/` -- Slash command dropdown menu
- `split-pane/` -- Side-by-side editor split view

## Dependencies
- `@/lib/constants` -- COMMANDS list
- `@/components/shared/useFocusTrap` -- focus trap hook (CommandPalette)

## Imported By
- `Editor.tsx` -- all chrome components
- `components/paper/Paper.tsx` -- SlashMenu
