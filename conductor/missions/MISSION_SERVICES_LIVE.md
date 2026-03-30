# Mission: Services Screen — Make It Live

**Created**: 2026-03-30
**Status**: Planning
**Milestone**: M1

---

## Goal

A freelancer can create, edit, and price their own services — then generate a real invoice from those services and send it to a client, all from the Services screen.

---

## Scope

### Deliverables

**D1 — Fix existing bugs**
- [ ] Fix array mutation in render: `services.sort()` on line 175 → `[...services].sort()`
- [ ] Guard division by zero: `totalEarned / totalUsed` when all services have 0 uses
- [ ] Remove dead `uid` import (line 6 — replaced by `Date.now()`)
- [ ] Compute `maxEarned` once before `.map()` loop (line 201), not inside it

**D2 — Lift services state to page.tsx**
- [ ] Add `services` state to page.tsx initialized from `INITIAL_SERVICES`
- [ ] Pass `services`, `onAddService`, `onUpdateService`, `onDeleteService` as props to ServicesPage
- [ ] Persist to localStorage (same pattern as workspaces/templates)
- [ ] ServicesPage accepts props instead of owning state

**D3 — New Service / Edit Service modal**
- [ ] Create `ServiceModal.tsx` + `ServiceModal.module.css`
- [ ] Fields: name, description, emoji picker, category dropdown, color picker
- [ ] Tier editor: add/remove tiers, each with name, price, unit (flat/per page/per month), estimated hours, includes list
- [ ] "Popular" toggle per tier
- [ ] Edit mode: pre-fills from existing service
- [ ] Wire "New Service" button in header → opens modal in create mode
- [ ] Wire service card long-press or edit button → opens modal in edit mode

**D4 — Connect invoice drawer to workspace/client picker**
- [ ] Replace plain text input with workspace/client dropdown (same pattern as DashboardHome quick-note picker)
- [ ] Client selection populates invoice header with client name/email
- [ ] Invoice items already work (add/remove) — no changes needed

**D5 — Wire "Send Invoice" and "Save Draft" buttons**
- [ ] "Send Invoice" → creates invoice record in state (page.tsx), closes drawer, shows success toast/confirmation
- [ ] "Save Draft" → saves to drafts array in state, closes drawer
- [ ] Invoice record: `{ id, client, items, total, status: "sent"|"draft", createdAt }`
- [ ] Add `invoices` state to page.tsx (or extend existing if it exists)
- [ ] Update `timesUsed` on the service when an invoice is sent containing it

**D6 — Delete service**
- [ ] Add delete button to service detail modal
- [ ] Confirmation prompt before deleting
- [ ] Cannot delete built-in/Felmark services (or show warning)
- [ ] Removes from state

**D7 — Verify**
- [ ] "New Service" → modal → fill fields → save → appears in grid
- [ ] Click service → detail modal → edit → save → updated in grid
- [ ] Add tier to invoice → client picker → "Send Invoice" → invoice created, `timesUsed` increments
- [ ] "Save Draft" → persists, retrievable
- [ ] Delete service → confirmation → removed
- [ ] No division by zero with 0 services or 0 uses
- [ ] `npm run build` passes
- [ ] No new lint errors

### Out of Scope
- Stripe payment processing (M3)
- Client-facing invoice view/payment page
- Invoice PDF export
- Service analytics dashboard (computed from real data — M2)
- Client ratings/reviews
- Service templates marketplace

---

## Constraints

- No new packages
- Must run in worktree (per Ground Rule #0)
- Services stored in page.tsx state, persisted to localStorage
- Invoice records are local state only (Supabase in M2)
- Reuse existing picker patterns (DashboardHome workspace picker)

---

## Affected Files

### New Files
- `dashboard/src/components/services/ServiceModal.tsx` — create/edit modal
- `dashboard/src/components/services/ServiceModal.module.css` — modal styles

### Modified Files
- `dashboard/src/components/services/ServicesPage.tsx` — accept props, fix bugs, wire CTAs
- `dashboard/src/app/page.tsx` — services state, invoice state, handlers, localStorage persistence
- `dashboard/src/components/editor/Editor.tsx` — pass services props through (if services screen is rendered via Editor)

### Dependencies (read-only)
- `dashboard/src/lib/types.ts` — may need `Invoice` type
- `dashboard/src/components/dashboard/DashboardHome.module.css` — reuse workspace picker pattern

---

## Standards to Follow

- [ ] UI/UX Guidelines — modal pattern, input styles, section labels
- [ ] Code review checklist
- [ ] Worktree execution (Ground Rule #0)

---

## Notes

- The Services screen already has solid UI: cards, tiers, detail modal, invoice drawer, filtering, sorting. The work is wiring — connecting dead CTAs to real state and persistence.
- The invoice flow is the key value chain: Service → Tier → Invoice → Client. Getting this end-to-end working (even with local state) proves the monetization path.
- `timesUsed` and `totalEarned` should update automatically when invoices are sent — these become live metrics instead of hardcoded numbers.
