---
name: "refactor"
description: "Run a safe incremental refactor on the specified target. Use when the user explicitly invokes $refactor or asks for this workflow in Felmark."
---

# Refactor — Safe Incremental Refactor

Run a safe incremental refactor on the specified target.

Follow `conductor/skills/refactor/SKILL.md`.

## Protocol
1. Snapshot — understand current behavior completely
2. Change — one concern per pass, minimal diff
3. Verify — confirm identical behavior after change
4. Commit — checkpoint before next pass

Do NOT combine multiple refactoring concerns. Do NOT change behavior.

