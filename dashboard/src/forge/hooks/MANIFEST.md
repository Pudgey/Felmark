# forge/hooks — MANIFEST

State management hooks extracted from `app/page.tsx` to reduce complexity.

## Exports

| File | Export | Description |
|------|--------|-------------|
| `usePersistence.ts` | `usePersistence` | All save/persistence logic: debounce, Cmd+S, indicator, tracked setters |
| `usePersistence.ts` | `loadFromStorage` | Generic localStorage loader (used by page.tsx lazy initializers) |
| `useShellLayout.ts` | `useShellLayout` | Shell UI state: sidebar, rail, zen mode, resize, launchpad |

## Dependencies

- `@/lib/types` — Block, Workstation, Tab, ArchivedProject
- `@/components/comments/CommentPanel` — Comment type
- `@/components/activity/ActivityMargin` — BlockActivity type

## Imported By

- `app/page.tsx`
