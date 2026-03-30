---
name: micro
description: Hyper-micro hardening for small interactions, edge-case navigation, and silent UI failures in Felmark.
---

# Micro -- Hyper-Micro Hardening

Hunt for tiny but consequential failures: controls that appear wired but are brittle, flows that look complete but quietly drop state, and UI details that fail only at the exact moment a user needs them.

References:
- `AGENTS.md`
- Target files in `dashboard/src/` or `extension/`

---

## Global Rules

- One category per pass
- Trace every finding end-to-end
- Do not assume a visible control is a working control
- Preserve the product flow while hardening it

---

## The Micro Formula

For every suspect element:

1. Find it
2. Trace it
3. Verify it
4. Harden it
5. Confirm it

No guess-and-check. Follow the full chain.

---

## Category 1: Navigation and Context

Hunt for:

- Links or buttons that route without required state
- Back actions that lose pane or tab context
- Deep links that cannot rebuild the intended view
- Modals or split panes that reopen in the wrong state

Trace pattern:

`trigger -> route/state update -> destination render -> expected context restored`

---

## Category 2: Small Interactive Elements

Hunt for:

- Icon buttons with no real handler
- Toggles that change UI but not persisted state
- Menus that expose unfinished actions
- Copy/share/export buttons that fail silently
- Inline controls that work once but not after rerender

Trace pattern:

`visible control -> handler -> state change -> persistence or side effect -> user feedback`

---

## Category 3: Feedback Loops

Hunt for:

- Saves with no success or failure signal
- Errors that disappear before a user can act on them
- Async actions that look stuck because status never changes
- Loading indicators that hide the actual failure path

---

## Category 4: Peripheral Integrations

Hunt for:

- Clipboard interactions
- share sheet fallbacks
- file download/export behavior
- browser storage reads and writes
- extension-to-app redirects

These are common silent failure zones because they sit at the boundary of the main app.

---

## Useful Scans

```bash
rg -n "onClick|router\\.push|router\\.replace|window\\.open|navigator\\.clipboard|localStorage|sessionStorage|chrome\\." dashboard/src extension
```

---

## Output Format

For each finding:

- File and line
- Element or interaction
- Broken link in the chain
- User impact
- Fix direction

---

## Done Criteria

- Every flagged element has a traced failure chain
- Silent failures are turned into explicit success or error behavior
- No stale stack-specific assumptions remain
