# Mission: Shared Primitives Extraction

**Status**: APPROVED — AWAITING EXECUTION
**Priority**: High
**Created**: 2026-03-30
**Owner**: claude-main

---

## Research Summary — Next.js/React 2026 Best Practices

### Sources
- [Top 8 Next.js Development Best Practices in 2026](https://www.serviots.com/blog/nextjs-development-best-practices)
- [React Architecture Patterns and Best Practices for 2026](https://www.bacancytechnology.com/blog/react-architecture-patterns-and-best-practices)
- [Modularizing React Applications — Martin Fowler](https://martinfowler.com/articles/modularizing-react-apps.html)
- [Feature-Driven Architecture with Next.js](https://dev.to/rufatalv/feature-driven-architecture-with-nextjs-a-better-way-to-structure-your-application-1lph)
- [Please Stop Using Barrel Files — TkDodo](https://tkdodo.eu/blog/please-stop-using-barrel-files)
- [How We Optimized Package Imports in Next.js — Vercel](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [React Stack Patterns 2026](https://www.patterns.dev/react/react-2026/)
- [React System Design & Architecture: The Complete 2026 Guide](https://qcode.in/react-system-design-architecture-the-complete-2026-guide/)

### Key Findings

**1. Shared stays primitive — never domain-specific**
> The common mistake is that "shared" becomes a dumping ground for business rules. The fix is to keep shared code primitive (UI + utilities) and push domain logic into features where ownership is clear.
— Martin Fowler, Modularizing React Applications

Felmark's `shared/` folder should only contain UI primitives (Avatar, IconButton, EmptyState) and utility hooks (useClickOutside, useEscapeKey). Business logic like "how a workspace calculates revenue" stays in the workspace feature folder.

**2. No barrel exports in Next.js**
> In a Next.js project, pages loading over 11k modules took 5-10 seconds to start-up, but after removing most internal barrel files, this reduced to about 3.5k modules — a 68% reduction.
— Vercel engineering blog

Never create `shared/index.ts` that re-exports everything. Import directly:
```typescript
// Good
import { Avatar } from "@/components/shared/Avatar";

// Bad — breaks tree-shaking
import { Avatar } from "@/components/shared";
```

**3. Custom hooks are the #1 reuse pattern in 2026**
> Custom hooks are the single most important pattern in modern React, letting you extract stateful logic into reusable functions that can be shared across components without changing the component hierarchy.
— React Architecture Patterns 2026

Our biggest duplication is in hooks, not components. `useClickOutside` is reimplemented 10 times. Extract hooks first, components second.

**4. Keep files under 250 lines**
> Aim to keep each file under 250 lines of code and break down larger components into smaller, reusable, and well-encapsulated sub-components.
— Next.js Development Best Practices 2026

Currently Editor.tsx is 1,525 lines. The core/ refactor mission handles that. For shared primitives, each file should be under 100 lines — these are simple, focused utilities.

**5. Feature-first, not type-first organization**
> Reorganize around features rather than file types, where each feature should own its slice, selectors, UI components, and tests, with a small public API.
— Vercel and Shopify architecture patterns

Our structure already does this — each block type owns its folder. The `shared/` folder is the exception: it's the only cross-feature folder, so it must stay lean and primitive.

**6. Separate concerns: business logic out of UI**
> Move all business logic out of UI components into Custom Hooks or Utility functions to separate concerns and improve code maintainability.
— React Best Practices 2026

The shared hooks we're extracting (useClickOutside, useEditableField) are pure UI behavior — no business logic. This is correct. Date formatting functions in `due-dates.ts` are also pure utilities with no domain coupling.

---

## Codebase Scan Results

### Hooks — Duplication Count

| Hook to Extract | Files Duplicating It | Count |
|----------------|---------------------|-------|
| `useClickOutside` | Editor, Sidebar, SlashMenu, CalendarFull, DashboardHome, DeliverableBlock, GraphDataEditor, ConversationPanel, DueDatePicker, EditorMargin | **10+** |
| `useEditableField` | AnimationBlocks, Sidebar, WorkspaceHome, ActivityMargin, DeadlineBlock, CalendarFull, Editor, EditorMargin | **8+** |
| `useEscapeKey` | Editor, CommandPalette, CalendarFull, EditableBlock, SlashMenu, TemplatePicker, DeliverableBlock, DashboardHome, Sidebar + 20 more | **30** |
| `useInView` | AnimationBlocks (local), TerminalWelcome, any scroll-triggered component | **5+** |

### Components — Duplication Count

| Component to Extract | Files Duplicating It | Count |
|---------------------|---------------------|-------|
| `Avatar` | Sidebar, DashboardHome, CollabBlocks, ConversationPanel, ShareView, WorkspaceHome, Notifications, DeliverableBlock | **8+** |
| `IconButton` | Sidebar, Notifications, Rail, ContentBlocks, PipelineBoard, ServicesPage, TeamScreen, Editor | **8+** |
| `EmptyState` | Editor, ConversationPanel, NotificationPanel, SearchPage | **4** |
| `SectionLabel` | Sidebar, EditorMargin, DashboardHome, Notifications, CalendarFull | **5+** |
| `Badge` | Notifications, Rail, Sidebar, UniqueBlocks | **3+** |

### Utilities — Cleanup Needed

| Issue | Location |
|-------|----------|
| `daysLeft()` in utils.ts | Duplicate of `getDaysLeft()` in due-dates.ts |
| `formatDue()` in utils.ts | Duplicate of `formatDueShort()` in due-dates.ts |
| `getDueLabelFromDate()` in utils.ts | Duplicate of `getDueLabel()` in due-dates.ts |
| `getDueColorFromDate()` in utils.ts | Duplicate of `getDueColor()` in due-dates.ts |

---

## Target Structure

```
shared/
├── Avatar.tsx                  ← 28-32px circle with initial + color
├── Avatar.module.css
├── IconButton.tsx              ← Square/round button with SVG icon + hover
├── IconButton.module.css
├── EmptyState.tsx              ← Centered icon + title + subtitle + action
├── EmptyState.module.css
├── SectionLabel.tsx            ← Mono uppercase 11px with letter-spacing
├── SectionLabel.module.css
├── Badge.tsx                   ← Count badge, status pill, PRO tag variants
├── Badge.module.css
├── useClickOutside.ts          ← Close on click outside a ref
├── useEditableField.ts         ← Double-click to edit with commit/cancel
├── useEscapeKey.ts             ← Global escape key handler
├── useInView.ts                ← IntersectionObserver trigger
├── DueDatePicker.tsx           ← Already exists
├── DueDatePicker.module.css    ← Already exists
├── ErrorBoundary.tsx           ← Already exists
└── useFocusTrap.ts             ← Already exists
```

**14 new files** + 4 existing = 18 total. Each file under 100 lines.

---

## Extraction Plan

### Phase 1: Hooks (highest deduplication ROI)

**Step 1: `useClickOutside.ts`**
```typescript
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  enabled?: boolean
): void
```
Then find-and-replace all 10+ implementations to use the shared hook.

**Step 2: `useEscapeKey.ts`**
```typescript
export function useEscapeKey(
  callback: () => void,
  enabled?: boolean
): void
```
Replace the 30 inline escape handlers. Many are inside `onKeyDown` alongside other keys — for those, just replace the escape branch.

**Step 3: `useEditableField.ts`**
```typescript
export function useEditableField(
  initialValue: string,
  onCommit: (value: string) => void
): {
  editing: boolean;
  draft: string;
  setDraft: (v: string) => void;
  startEditing: () => void;
  commitEdit: () => void;
  cancelEdit: () => void;
  inputProps: { value: string; onChange: ...; onBlur: ...; onKeyDown: ...; autoFocus: true };
}
```

**Step 4: `useInView.ts`**
```typescript
export function useInView(
  options?: IntersectionObserverInit
): { ref: React.RefObject<HTMLElement>; inView: boolean }
```
Already local in AnimationBlocks — move to shared, update imports.

### Phase 2: Components

**Step 5: `Avatar.tsx`**
Props: `size?: number`, `letter: string`, `color: string`, `className?: string`

**Step 6: `IconButton.tsx`**
Props: `size?: number`, `icon: ReactNode`, `onClick`, `title`, `variant?: "default" | "danger"`, `className?: string`

**Step 7: `EmptyState.tsx`**
Props: `icon?: ReactNode`, `title: string`, `subtitle?: string`, `action?: { label: string; onClick: () => void }`

**Step 8: `SectionLabel.tsx`**
Props: `children: string`, `withLine?: boolean` (the `::after` flex line)

**Step 9: `Badge.tsx`**
Props: `children: string`, `variant?: "count" | "status" | "pro"`, `color?: string`

### Phase 3: Utility Cleanup

**Step 10: Remove date duplicates from utils.ts**
Delete `daysLeft`, `formatDue`, `getDueLabelFromDate`, `getDueColorFromDate` from utils.ts. Update all imports to use `due-dates.ts` functions.

---

## Rules (from 2026 research)

1. **No barrel exports** — import each shared file directly, never through an index.ts
2. **No business logic in shared/** — only UI behavior and visual primitives
3. **Each file < 100 lines** — if it's longer, it's not primitive enough
4. **No shared component may import from a feature folder** — dependency flows one direction: features → shared, never shared → features
5. **Props over context** — shared components take explicit props, never read from context
6. **CSS modules per component** — no global shared stylesheet

---

## Verification

After each step:
```bash
# 1. Build passes
npm run build

# 2. No broken imports
npx tsc --noEmit

# 3. Old implementations removed
# grep for the pattern that was extracted — should find only the shared version
grep -r "addEventListener.*mousedown" dashboard/src/components --include="*.tsx" | grep -v shared | grep -v node_modules
# Expected: 0 results (all migrated to useClickOutside)
```

---

## Success Criteria

| Metric | Before | After |
|--------|--------|-------|
| Click-outside implementations | 10+ | 1 (shared hook) |
| Escape key handlers | 30 | 1 hook + inline for multi-key handlers |
| Editable field patterns | 8+ | 1 (shared hook) |
| Avatar CSS duplicates | 8+ | 1 component |
| IconButton CSS duplicates | 8+ | 1 component |
| EmptyState duplicates | 4 | 1 component |
| Date utility duplicates | 4 functions in utils.ts | 0 (removed, use due-dates.ts) |
| Files in shared/ | 4 | 18 |
| Lines per shared file | — | <100 |

---

## Dependencies

- No new packages
- No type changes
- No API changes
- Can run before or after the Editor Core Refactor mission (independent)

## Not In Scope

- Drag-and-drop extraction (too context-specific for a shared hook)
- Color utilities (not enough duplication to justify)
- Block-specific patterns (those stay in their feature folders)
