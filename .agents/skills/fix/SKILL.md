---
name: "fix"
description: "Resolve a specific finding or bug. Use when the user explicitly invokes $fix or asks for this workflow in Felmark."
---

# Fix — Resolve a Finding or Bug

Resolve a specific finding or bug.

Follow `conductor/skills/fix/PROTOCOL.md`.

## Steps
1. **Verify** — Reproduce and confirm the issue exists
2. **Fix** — Apply the minimal correct change
3. **Verify** — Confirm the fix resolves the issue without regressions
4. **Update** — Mark resolved in any tracking docs

One fix per invocation. Do not bundle unrelated changes.

