# Shared -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `DueDatePicker` -- Date picker with urgency colors and quick-date presets
- `ErrorBoundary` -- React error boundary with fallback UI
- `ThemeLoader` -- Applies and syncs theme on mount
- `useFocusTrap` -- Hook to trap focus within a modal/panel

## Dependencies
- `@/lib/due-dates` -- getDueLabel, getDueColor, getDueBg, formatDueShort, getQuickDates, getDueUrgency
- `@/lib/themes` -- THEMES, applyTheme, getActiveTheme

## Imported By
- `Editor.tsx` -- DueDatePicker used in block rendering
- `page.tsx` -- ErrorBoundary wraps main layout
- `CommandPalette.tsx` -- useFocusTrap for modal focus
- `HistoryModal.tsx` -- useFocusTrap for modal focus

## Files
- `DueDatePicker.tsx` -- date picker component (109 lines)
- `DueDatePicker.module.css` -- styles
- `ErrorBoundary.tsx` -- error boundary (65 lines)
- `ThemeLoader.tsx` -- theme loader (20 lines)
- `useFocusTrap.ts` -- focus trap hook
