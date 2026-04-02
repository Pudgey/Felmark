---
name: "polish"
description: "Run a pre-release polish checklist on the specified target. Use when the user explicitly invokes $polish or asks for this workflow in Felmark."
---

# Polish — Pre-Release Checklist

Run a pre-release polish checklist on the specified target.

Follow `conductor/skills/polish/PROTOCOL.md`.

## Apply when a feature hits ~70% completion. Checks:
- UI consistency (spacing, alignment, color usage)
- Edge cases (empty states, long text, rapid clicks)
- System hardening (error boundaries, loading states)
- Safety (no console.logs, no hardcoded secrets, no debug UI)
- Accessibility basics (labels, contrast, keyboard nav)

Report what's ready and what needs attention before shipping.

