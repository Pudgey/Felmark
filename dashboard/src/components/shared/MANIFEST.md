# Shared — Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports

| File | Type | What | Used by |
|---|---|---|---|
| `DueDatePicker.tsx` | UI | Date picker with urgency colors, calendar, quick picks | Editor meta bar, deliverables, deadlines |
| `DocumentOutline.tsx` | UI | Heading list from blocks — indentation, section numbers, click-to-scroll, active state | EditorMargin, Forge Paper |
| `ErrorBoundary.tsx` | Layout | React error boundary with fallback UI | Root layout wraps everything |
| `ThemeLoader.tsx` | UI | Applies and syncs theme on mount | Layout |
| `useFocusTrap.ts` | Hook | Traps keyboard focus inside a container | Command palette, history modal, share modal |

## Dependencies
- `@/lib/due-dates` — getDueLabel, getDueColor, getDueBg, formatDueShort, getQuickDates, getDueUrgency
- `@/lib/themes` — THEMES, applyTheme, getActiveTheme
- `@/lib/types` — Block (for DocumentOutline)

## Rules

1. **3+ consumers** — don't extract until three places need it
2. **Pure UI or pure logic** — no business rules, no forge calls, no API fetches
3. **Context-agnostic** — must work without knowing which editor/page/panel it's inside
4. **Flat structure** — no subfolders until 10+ files
5. **Update this file** when adding, renaming, or removing components
6. **CSS modules** — each UI component gets its own `.module.css`
