---
name: polish
description: Pre-release polish and hardening checklist for a nearly complete Felmark feature.
---

# Polish -- Pre-Release Polish & Hardening

Use this when a feature is materially built and needs to be turned into something shippable. Polish is the final pass that removes rough edges, silent failures, and visual sloppiness without changing the feature's scope.

References:
- `AGENTS.md`
- Relevant mission docs
- The target code under `dashboard/src/` or `extension/`

---

## Gate Condition

Do not run polish until the feature already has:

- Core behavior working
- Intended route or entry point wired
- Data flow either real or explicitly stubbed

If the feature is still missing core behavior, finish that first.

---

## Phase 1: Interface Finish

Check:

- Visual hierarchy is obvious on first scan
- Empty, loading, and error states look intentional
- Toolbars, menus, and controls do not feel crowded
- Mobile and desktop versions both hold together
- Copy is specific and on-brand, not placeholder text

---

## Phase 2: Interaction Finish

Check:

- Buttons and controls have clear hover, focus, pressed, and disabled states
- Async actions show progress and cannot be double-fired accidentally
- Destructive actions have the right confirmation pattern
- Success and failure feedback is immediate and unambiguous

Look especially at share, save, rename, delete, export, and workspace-switch flows.

---

## Phase 3: Resilience

Check:

- Network failures do not strand the user
- Missing data does not collapse the layout
- Partial state does not look like finished state
- Long strings, empty lists, and stale records degrade cleanly

If a user can lose work or think a save succeeded when it did not, polish is not complete.

---

## Phase 4: Quality Pass

Run available verification:

```bash
npm run lint
npm run build
```

Then manually verify the target flow end-to-end.

If the repo or subproject uses different scripts, use those instead.

---

## Phase 5: Product Fit

Confirm:

- The feature still feels like Felmark, not a generic dashboard widget
- It supports freelancer work, not abstract productivity theater
- The UI does not imply capabilities that are not actually wired

Remove dead affordances rather than shipping fake ambition.

---

## Done Criteria

- The feature feels intentional, not merely functional
- No obvious silent failures remain
- Visual and interaction quality are aligned with the rest of the product
