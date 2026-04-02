---
name: bruteforce
description: Orchestrate a multi-angle adversarial audit for Felmark to uncover data, state, UX, and architecture failures.
---

# BRUTEFORCE -- Adversarial Codebase Audit

Run a broad, skeptical audit against Felmark. This skill is for finding what normal implementation passes miss: state drift, broken flows, dead affordances, bad assumptions, and architecture rot.

References:
- `AGENTS.md`
- `CLAUDE.md`
- Relevant code under `dashboard/src/`, `extension/`, and `conductor/`

---

## Audit Lanes

Split the audit into five perspectives:

1. Data integrity
2. Async and state safety
3. UX dead zones
4. Navigation and flow continuity
5. Structural and architectural drift

Each lane should produce independent findings. Do not merge them into one vague summary.

---

## Pre-Flight

Before auditing:

1. Snapshot the current repo state
2. Identify the target directories
3. Gather known open issues so you do not re-report them as new
4. Confirm you are auditing a stable state, not half-finished work

Useful scans:

```bash
git status --short
rg --files dashboard/src extension
```

---

## Lane 1: Data Integrity

Hunt for:

- Types that drift from actual stored shapes
- Unsafe assumptions around nullability
- Export/share payloads that omit required fields
- Mismatch between UI expectations and persistence shape

---

## Lane 2: Async and State Safety

Hunt for:

- Actions that can fire twice
- Saves that race with route changes
- Optimistic updates without rollback
- State updates that assume success before confirmation

---

## Lane 3: UX Dead Zones

Hunt for:

- Buttons that appear active but do nothing
- Menus or icons that imply unfinished features
- Loading states that hide errors
- Empty states that provide no recovery path

---

## Lane 4: Navigation and Flow Continuity

Hunt for:

- Broken share, rename, open, and back behaviors
- Routes that require state which is not guaranteed
- Modals or panes that trap users or lose context
- Deep links that cannot reconstruct the intended screen

---

## Lane 5: Structural Drift

Hunt for:

- Business logic leaking into presentation components
- Feature code split across unrelated folders
- Stale prototypes or docs still steering current code
- Duplicate patterns that should have converged already

---

## Output Format

Each finding should include:

- ID
- Severity
- Lane
- Evidence
- User impact
- Fix direction

Findings first, synthesis second.

---

## Done Criteria

- All five lanes were covered
- Findings are specific and non-duplicative
- The audit is valid for Felmark's web stack, not a copied mobile checklist
