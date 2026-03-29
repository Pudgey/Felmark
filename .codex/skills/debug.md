# Debug — Parallel Hypothesis Debugging

Run systematic parallel hypothesis debugging on the specified target.

Follow `conductor/skills/debug/SKILL.md`.

## Steps
1. **Reproduce** — Define the exact steps to trigger the bug
2. **Hypothesize** — Generate 3-5 possible root causes (parallel, not sequential)
3. **Test each hypothesis** — Read code, add logging, check state at key points
4. **Eliminate** — Cross off hypotheses that don't match evidence
5. **Isolate** — Narrow to the single root cause
6. **Fix** — Minimal change that addresses the root cause
7. **Verify** — Confirm the fix resolves the original reproduction
8. **Prevent** — Add a test or guard to prevent regression

## Rules
- Never guess-and-check (change random things hoping it works)
- Never suppress errors to make them go away
- Always understand WHY before fixing WHAT
- Document the root cause in the commit message

If no bug is specified, ask the user what to debug.
