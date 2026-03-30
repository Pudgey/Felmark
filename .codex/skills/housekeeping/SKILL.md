---
name: "housekeeping"
description: "Run a codebase cleanup sweep on the specified target. Use when the user explicitly invokes $housekeeping or asks for this workflow in Felmark."
---

# Housekeeping — Codebase Cleanup Sweep

Run a codebase cleanup sweep on the specified target.

Follow `conductor/skills/housekeeping/SKILL.md`.

## Sweep for:
- Dead files (unreferenced components, unused exports)
- Build artifacts and temp files
- Stale imports and phantom routes
- Outdated comments and TODO items
- Reports and docs that reference deleted code

If no scope specified, sweep the entire project.

