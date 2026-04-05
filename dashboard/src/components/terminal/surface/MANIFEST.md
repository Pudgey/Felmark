# Terminal Surface

Rail-level terminal with split layout: command terminal (left) + feature preview (right).

## Exports
- `TerminalSurface` — default export, main split layout component

## Dependencies
- `../TerminalProvider` — command execution context
- `../mounts/SharedTerminalProvider` — shared session state
- `@/lib/terminal/commands` — COMMAND_REGISTRY for feature grid
- `@/lib/themes` — THEMES for theme preview

## Imported By
- `views/terminal.tsx` — dashboard view wrapper

## Files
- `TerminalSurface.tsx` — Split layout container
- `TerminalSurface.module.css` — Layout styles
- `TerminalInput.tsx` — Command input with history + palette
- `TerminalInput.module.css` — Input styles
- `TerminalOutput.tsx` — Scrollable block output
- `TerminalOutput.module.css` — Output styles
- `TerminalPreview.tsx` — Right panel router
- `previews/` — Preview components subfolder
