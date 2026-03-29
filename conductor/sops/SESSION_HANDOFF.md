# Session Handoff SOP

> **Version**: 1.0
> **Created**: 2026-03-24

## Purpose

Ensure context survives between sessions. Every non-trivial session writes a handoff so the next agent/session can pick up without re-discovering context.

## When to Write

- After any session that modifies code
- After any session that changes plans or priorities
- After any debugging session (even if the bug isn't fixed yet)
- Skip for purely conversational sessions

## Template

```markdown
# Session Handoff — YYYY-MM-DD

## What just happened
One paragraph: session focus and deliverables.

## In-progress work
Files mid-edit, branches not merged, tests not passing.

## Remaining Tasks
- [ ] Checkbox list of next steps

## Gotchas
Landmines the next session needs to avoid.
```

## Rules

1. Write to `HANDOFF.md` (overwrites previous — only latest matters)
2. Be specific about file paths and states
3. Include any uncommitted changes or unstashed work
4. Mention any environment state (running servers, open PRs, pending deploys)
5. Keep it under 30 lines — this is a handoff, not a report
