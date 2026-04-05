# Terminal Previews

Preview components for the terminal surface right pane.

## Exports
- `FeatureGrid` — compact list of commands and surfaces (dark, dense rows with amber hover)
- `CommandPreview` — per-command contextual preview

## Dependencies
- `@/lib/terminal/commands` — COMMAND_REGISTRY
- `@/lib/themes` — THEMES
- `../../TerminalProvider` — useTerminalContext

## Imported By
- `../TerminalPreview.tsx`

## Files
- `FeatureGrid.tsx` — Compact command list with sections and surfaces
- `CommandPreview.tsx` — Per-command preview cards
- `previews.module.css` — Shared preview styles
