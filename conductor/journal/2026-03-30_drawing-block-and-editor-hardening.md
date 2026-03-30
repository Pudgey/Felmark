# Journal: Drawing Block + Editor Hardening

**Date**: 2026-03-30
**Agent**: claude-main
**Tags**: block-editor, drag-drop, slash-menu, new-block-type, bug-fix

## Context
Built the `/drawing` block with 8 visual component types, then hardened drag-and-drop, slash menu positioning, empty block focus, and outline sidebar context menu.

## Discovery
- Drag-and-drop on complex blocks was entirely non-functional — only the text-block fallthrough path had `draggable`/`onDragOver`/`onDrop` handlers. All ~30 complex block renders were missing them.
- Chrome requires `e.dataTransfer.setData()` for HTML5 drag to initiate. Without it, the drag silently fails (no ghost image, no events).
- The CSS `:empty` pseudo-selector for contentEditable placeholders is fragile — `cursorTo()` injects invisible DOM nodes (zero-width spaces, selection artifacts) that break `:empty`, causing the placeholder to vanish and slash detection to fail.
- The slash menu was positioned using editor-relative coordinates (`scrollTop` offset math) but rendered with `position: fixed` (viewport-relative), causing it to appear off-screen below tall blocks like graphs.
- `setTimeout(20)` for focusing newly created blocks races with React's `useEffect` that registers refs in `blockElMap` — often fires before the ref exists, silently skipping focus.

## What Worked
- **`wrapBlock` helper**: Extracted the repeated blockRow+gutter+grip+drag pattern into a single function, reducing 84 lines of duplication while adding full drag support to every block type.
- **`is-empty` class**: Replaced CSS `:empty` with a JS-managed class that strips invisible characters before checking emptiness. Robust against browser DOM quirks.
- **`focusNew` retry pattern**: Polls `blockElMap` up to 5×20ms instead of a single fire-and-forget timeout. Eliminates the ref registration race condition.
- **Viewport-aware slash menu**: Uses `getBoundingClientRect()` directly for fixed positioning, flips above when not enough space below.

## What Didn't Work
- Initial drag-and-drop fix (adding handlers to `wrapBlock`) didn't work until `setData()` was added — Chrome-specific requirement that's easy to miss.

## Future Guidance
- Any new block render path in `renderBlock` should use `wrapBlock()` — never manually build blockRow+gutter.
- The slash menu positioning should eventually also handle horizontal clamping for narrow viewports.
- The outline sidebar now has a right-click context menu — add more actions there as needed (duplicate, move up/down).
- Watch for the `is-empty` class if any other code manipulates contentEditable innerHTML directly.
