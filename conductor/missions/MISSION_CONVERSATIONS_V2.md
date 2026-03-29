# Mission: Conversations V2

**Created**: 2026-03-29
**Status**: Complete
**Milestone**: M1

---

## Goal

Replace the conversation panel with a richer V2 that adds pinning, muting, typing indicators, threaded metadata, priority flags, keyboard navigation, and grouped conversation lists — all using CSS modules and integrated into the existing editor layout.

---

## Scope

### Deliverables

**D1 — Convert inline styles to CSS module**
- [x] Create `ConversationPanel.module.css` with all V2 styles (replace inline `<style>` block)
- [x] Remove duplicate `:root` variables and `<link>` font imports (inherit from layout.tsx)
- [x] Remove fire emoji reaction from seed data

**D2 — Port V2 component into dashboard**
- [x] Replace existing `ConversationPanel.tsx` with V2 logic + TypeScript types
- [x] Preserve existing `open`/`onClose` props interface
- [x] Wire `convoPanelOpen` toggle in Editor.tsx (already exists)

**D3 — Fix review findings**
- [x] Add outside-click handler to dismiss `new-menu` and `dm-picker`
- [x] Wire `⌘F` keyboard shortcut to focus search input
- [x] Reset `kbIndex` when filter/search changes
- [x] Fix `flatList` / `select` stale closure in keyboard nav `useEffect`
- [x] Add `useCallback` to `createDm` to prevent stale state
- [x] Resolve `uid` variable shadowing — renamed to `genId`

**D4 — Missing states**
- [x] Add empty state for "no conversations yet" (distinct from "no results")
- [x] Add loading skeleton state (shimmer CSS ready, component can render skeletons)

**D5 — Verify integration**
- [x] Conversation panel opens/closes via toolbar button in tab bar
- [x] Unread badge in tab bar reflects V2 unread count
- [x] Panel respects existing editor layout (flexbox, no overflow)
- [x] `npm run build` passes clean
- [x] No new lint errors introduced

### Out of Scope
- Real-time messaging backend (Supabase Realtime) — that's M2+
- Threaded replies UI (showing thread contents) — future iteration
- File upload / attachment sending — future iteration
- Message editing / deletion — future iteration
- Notification sounds or desktop notifications
- Full-page "Open full view" route

---

## Constraints

- No new packages without approval
- Must use CSS modules (not inline styles, not Tailwind utility classes beyond what's already in the project)
- Panel width stays at 320-340px range (matches existing ConversationPanel)
- Must not break existing Editor, Sidebar, or tab bar behavior

---

## Affected Files

### New Files
- (none — replacing existing files in-place)

### Modified Files
- `dashboard/src/components/editor/ConversationPanel.tsx` — full rewrite with V2 logic
- `dashboard/src/components/editor/ConversationPanel.module.css` — full rewrite with V2 styles
- `dashboard/src/components/editor/Editor.tsx` — update unread badge count to use V2 data

### Dependencies (read-only)
- `dashboard/src/app/layout.tsx` — font variables already available
- `dashboard/src/app/globals.css` — CSS variables already defined
- `dashboard/src/components/editor/Editor.module.css` — panel layout styles

---

## Standards to Follow

- [ ] TAB_BAR_BEHAVIOR — unread badge in tab bar right column
- [ ] Code review checklist (no dead code, proper cleanup, edge cases)

---

## Notes

- The V2 prototype was provided as a standalone JSX component with inline styles. The core logic (grouping, filtering, keyboard nav, pin/mute) is solid — the work is mostly conversion + bug fixes.
- The existing V1 has a chat view with message composer that V2's prototype doesn't include. Preserve the V1 chat view and composer — V2 only upgrades the conversation list.
- Seed data stays hardcoded for now (same as V1). Real data wiring is M2 scope.
