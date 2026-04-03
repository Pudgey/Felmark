# forge/hooks -- MANIFEST

State management hooks extracted from `app/page.tsx` to reduce complexity.

## Exports

| File | Export | Description |
|------|--------|-------------|
| `usePersistence.ts` | `usePersistence` | All save/persistence logic: debounce, Cmd+S, indicator, tracked setters |
| `usePersistence.ts` | `loadFromStorage` | Generic localStorage loader (used by page.tsx lazy initializers) |
| `useHydrateAppState.ts` | `useHydrateAppState` | Mount-once hydration effect: reads localStorage, reconciles tabs, calls all state setters |
| `useHydrateAppState.ts` | `ensureActiveTab` | Ensures at least one tab is active (also used by page.tsx SSR default) |
| `useHydrateAppState.ts` | `reconcileTabs` | Reconciles saved tabs against current workstation data |
| `useHydrateAppState.ts` | `INITIAL_TABS` | Seed tabs constant (also used by page.tsx SSR default) |
| `useHydrateAppState.ts` | `SUPPORTED_BLOCK_TYPES` | Set of known block type strings for editor memory validation |
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
