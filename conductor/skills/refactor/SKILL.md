---
name: refactor
description: Safe incremental refactoring for Felmark. One concern per pass, verify before and after, and keep the blast radius explicit.
---

# Refactor -- Safe Incremental Code Improvement

Apply a single, well-scoped refactor to Felmark without changing behavior. This skill exists to improve structure, naming, or duplication while keeping product behavior stable.

References:
- `AGENTS.md` (hard constraints)
- `CLAUDE.md` (project architecture)
- Relevant mission docs in `conductor/missions/`

---

## Step 0: Scope the Refactor

Before touching code, answer these questions:

1. What is the single concern?
2. Which files are in scope?
3. What proof will show behavior stayed the same?

### Scope Rules

- One concern per pass.
- No feature work hidden inside the refactor.
- No drive-by fixes. Log them separately.
- If the blast radius grows beyond five files, checkpoint before continuing.

---

## Step 1: Baseline

Capture the current state before editing:

```bash
git status --short
rg -n "SymbolName|ComponentName" dashboard/src extension
```

Run whatever verification exists for the touched area:

```bash
npm run lint
npm run build
```

If the repo or subproject has different scripts, use those instead. If no automation exists, note that explicitly and define a manual verification path.

---

## Step 2: Map the Blast Radius

Read:

1. The file you plan to change
2. Every file that imports it
3. Every call site for any symbol you rename or reshape

Useful scans:

```bash
rg -n "from './target'|from \"./target\"" dashboard/src extension
rg -n "ComponentName|hookName|typeName" dashboard/src extension
```

Write down the dependent files. Those files must be re-checked after the refactor.

---

## Step 3: Make the Change

Apply the smallest structural change that achieves the refactor:

- Rename for clarity
- Extract repeated UI into a component
- Collapse dead branching
- Move code to the correct layer
- Tighten types without changing behavior

Keep the old behavior visible while editing. If you cannot explain why the behavior is unchanged, the refactor is not scoped tightly enough.

---

## Step 4: Verify

After the change:

```bash
npm run lint
npm run build
```

Then do targeted verification:

- Re-open every touched screen or flow
- Exercise the specific interaction paths affected by the refactor
- Re-check any renamed imports, props, return types, or CSS modules

If tests exist for the area, run them as well.

---

## Step 5: Review

Confirm all of the following:

- No user-facing behavior changed
- No new files were touched outside the declared blast radius
- Imports and exports remain coherent
- Types are tighter or unchanged, never weaker without reason
- Dead code created by the refactor was removed

---

## Common Refactor Patterns

### Extract duplicated UI

- Good: repeated block controls moved into a shared component
- Bad: shared component plus new behavior changes in the same pass

### Rename a type or prop

- Update every call site in one pass
- Re-run the exact flows that consume the renamed API

### Move logic across layers

- UI formatting stays in UI
- Persistence stays in data layer
- Shared transforms move to `dashboard/src/lib/` only when reused

---

## Abort Conditions

Stop and checkpoint if any of these happen:

- The refactor starts changing behavior
- The file count grows unexpectedly
- Verification starts failing for unrelated reasons
- You feel pressure to add compatibility shims just to make the diff survive

---

## Done Criteria

- Single concern completed
- Verification run and recorded
- No stale imports or dead wrappers left behind
- Change is smaller and clearer than before
