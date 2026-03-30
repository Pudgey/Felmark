---
name: housekeeping
description: Clean up repo artifacts, stale docs, old prototypes, and candidate dead web files without deleting active product work by accident.
---

# Housekeeping -- Codebase Cleanup Sweep

Periodic maintenance skill for Felmark. Use it to identify reclaimable junk, stale generated output, and low-confidence dead files. Default mode is dry-run. Destructive cleanup requires explicit confirmation.

References:
- `conductor/journal/INDEX.md`
- `conductor/THOUGHTS.md`
- `AGENTS.md`

---

## Safety Rules

1. Never auto-delete active mission docs, standards, skills, or journal indexes.
2. Never remove tracked source files without explicit confirmation.
3. Default to scan mode first.
4. Build outputs are safe to remove only when they are reproducible.
5. Dead-file detection is advisory unless the user asks for deletion.

---

## Step 0: Scan Mode

Before deleting or patching anything, gather a scan summary:

```text
HOUSEKEEPING SCAN RESULTS
Pass 1: Artifacts and temp files
Pass 2: Prototype drift
Pass 3: Stale conductor output
Pass 4: Candidate dead source files
Pass 5: Stale imports or broken references
```

Show the user what you found and what is safe versus advisory.

---

## Pass 1: Artifacts and Temp Files

Safe candidates:

- `.next/`
- `dist/`
- `coverage/`
- `*.log`
- `.DS_Store`
- `*.tsbuildinfo`
- temporary screenshots or local scratch outputs

Example scans:

```bash
find . -name '.next' -o -name 'dist' -o -name 'coverage' 2>/dev/null
find . -name '.DS_Store' -o -name '*.log' -o -name '*.tsbuildinfo' 2>/dev/null
```

---

## Pass 2: Prototype Drift

Review `Prototype/` and compare with current production surfaces:

- Does the prototype still represent an unbuilt idea?
- Was the idea already shipped elsewhere?
- Is the prototype misleading because the live product diverged?

Do not delete prototypes automatically. Flag them for confirmation.

---

## Pass 3: Stale Conductor Output

Check for:

- Old handoffs that conflict with current state
- Journal gaps or duplicate summaries
- Missions that no longer match active work
- Standards that reference removed paths or obsolete tooling

This pass is mostly editorial, not destructive.

---

## Pass 4: Candidate Dead Source Files

Search for `.ts`, `.tsx`, `.css`, and related files that appear unused.

Useful process:

1. Find the file
2. Search for imports and symbol references
3. Check routing and dynamic imports
4. Confirm it is not only referenced by configuration or string lookup

Useful scans:

```bash
rg --files dashboard/src extension
rg -n "ComponentName|fileName" dashboard/src extension
```

Only report low-confidence candidates as candidates. Do not delete them automatically.

---

## Pass 5: Stale Imports and Broken References

Look for:

- Imports pointing at removed files
- Routes with no reachable destination
- Components that still reference old prototype names
- Conductor docs that reference dead paths or the wrong stack

This pass is often where stale framework references show up.

---

## Output Format

For each pass, classify items as:

- Safe to remove
- Needs confirmation
- Needs manual investigation

If executing cleanup after confirmation, work in small batches and verify the repo still builds or at least lints where automation exists.

---

## Done Criteria

- Scan summary produced
- Safe artifacts clearly separated from risky deletions
- No mobile-only or Flutter-specific cleanup rules remain
