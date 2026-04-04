# editor/ -- Manifest

> Block editor system. Organized into four areas.

## Structure

- `blocks/` -- All block-type components (40+ types across 6 categories)
- `chrome/` -- Editor UI (command-bar, command-palette, editable-block, format-bar, margin, slash-menu, split-pane)
- `core/` -- Editor core: hooks, components (tab-bar, toolbar, block-registry, block-renderer, breadcrumb, document-surface, zen-hint), EditorCore.tsx
- `panels/` -- Slide-out panels (conversation, cat, share-modal)

## Exports
- `core/EditorCore.tsx` -- Main editor component
- `blocks/*/` -- Individual block components
- `chrome/*/` -- Editor chrome components

## Dependencies
- `@/lib/types` -- Block, ForgeState, type definitions
- `@/forge/` -- State management hooks
- `react` -- Component framework

## Imported By
- `views/workstation.tsx` -- via EditorCore
- `workstation/templates/TemplatePicker.tsx` -- block previews
