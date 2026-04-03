# forge/hooks -- MANIFEST

State management hooks extracted from `app/page.tsx` to reduce complexity.

## Exports

| File | Export | Description |
|------|--------|-------------|
| `usePersistence.ts` | `usePersistence` | All save/persistence logic: debounce, Cmd+S, indicator, tracked setters |
| `usePersistence.ts` | `loadFromStorage` | Generic localStorage loader (used by page.tsx lazy initializers) |
| `useShellLayout.ts` | `useShellLayout` | Shell UI state: sidebar, rail, zen mode, resize, launchpad |
| `useWorkstationActions.ts` | `useWorkstationActions` | All workstation handler functions (toggle, select, tab management, archive, onboarding, forge rail) |
| `useWorkstationActions.ts` | `CreationAnimState` | Type for the creation animation state |
| `useWorkstationActions.ts` | `UseWorkstationActionsConfig` | Config interface for the hook |
| `useWorkstationActions.ts` | `UseWorkstationActionsResult` | Return type interface |

## Dependencies

- `@/lib/types` -- Block, Workstation, Tab, ArchivedProject, WorkstationTemplate, Project
- `@/lib/utils` -- uid (used by makeEmptyBlocks in useWorkstationActions)
- `@/components/comments/CommentPanel` -- Comment type
- `@/components/activity/ActivityMargin` -- BlockActivity type
- `@/forge` -- createForge, StateUpdater, Forge

## Imported By

- `app/page.tsx`
