---
name: fix
description: Work a concrete finding from an audit, review, bug report, or handoff. Verify it, fix it, prove it, and record the outcome.
---

# Fix -- Resolve a Concrete Finding

Use this skill when there is a specific issue to work: a review comment, audit finding, bug report, or handoff note. The key rule is simple: verify the problem before fixing it, then prove the fix actually addresses the real failure.

References:
- The finding source itself: review thread, audit doc, handoff, mission note, or user report
- `AGENTS.md`
- Relevant code under `dashboard/src/` or `extension/`

---

## Step 0: Pick the Exact Finding

A good finding includes:

- What is wrong
- Where it happens
- How severe it is
- How to observe it

If the report is vague, turn it into a concrete statement before changing code.

---

## Step 1: Verify the Issue

Before editing:

1. Read the affected files
2. Trace the relevant interaction or data path
3. Confirm the issue still exists

Useful scans:

```bash
rg -n "pattern|ComponentName|hookName" dashboard/src extension
```

Possible outcomes:

- Still present: continue
- Already fixed: record that and stop
- False positive: record why and stop
- Partially fixed: isolate the remaining problem and continue

---

## Step 2: Understand the Root Cause

Do not patch symptoms blindly. Identify the failure class:

- Data shape mismatch
- Missing guard or validation
- Broken async flow
- Wrong route or state handoff
- UI affordance with no real effect
- Accessibility or copy issue
- Security boundary mistake

State the root cause in one sentence before editing.

---

## Step 3: Apply the Minimal Correct Fix

Rules:

- Fix the reported issue, not the whole neighborhood around it
- Follow existing project patterns
- Keep the diff as small as correctness allows
- If the blast radius expands, stop and reassess

If related bugs surface, note them separately instead of folding them in silently.

---

## Step 4: Verify the Fix

Run available verification:

```bash
npm run lint
npm run build
```

Then manually verify the original reproduction path.

Check:

- The original issue is resolved
- No new regression is visible nearby
- The fix behaves correctly in success and failure states

If there is no automation for the touched area, say so and document the manual verification instead.

---

## Step 5: Record the Outcome

Update the source of truth for the finding if one exists:

- Review thread
- Audit doc
- Handoff note
- Mission checklist
- Journal entry

Record:

- Fixed
- Already resolved
- Not an issue
- Deferred with reason

---

## Done Criteria

- Problem verified before editing
- Root cause understood
- Minimal correct fix applied
- Verification completed
- Finding status updated where appropriate
