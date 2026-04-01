# Canvas Chrome -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `BlockChrome` (default) -- Chrome bar with handle, type label, size badge, configure/remove buttons
- `ReplacePopover` (default) -- Block type picker popover using BLOCK_DEFS
- `Splitter` (default) -- Left/right resize handle (placeholder for future resize implementation)

## Dependencies
- `../registry` -- BLOCK_DEFS (used by ReplacePopover)
- `./BlockChrome.module.css`
- `./ReplacePopover.module.css`
- `./Splitter.module.css`

## Imported By
- `../Canvas.tsx` -- BlockChrome and ReplacePopover rendered per block in edit mode

## Files
- `BlockChrome.tsx` -- Responsive chrome bar (handle, label, size, configure, remove)
- `BlockChrome.module.css` -- Chrome bar styles
- `ReplacePopover.tsx` -- Block type picker with current type highlighted
- `ReplacePopover.module.css` -- Popover styles with popIn animation
- `Splitter.tsx` -- Left/right resize handle
- `Splitter.module.css` -- Splitter styles
