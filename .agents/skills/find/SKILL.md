---
name: "find"
description: "Run a read-only codebase sweep on the specified target. Use when the user explicitly invokes $find or asks for this workflow in Felmark."
---

# Find — Read-Only Codebase Sweep

Run a read-only codebase sweep on the specified target.

Follow `conductor/skills/find/PROTOCOL.md`.

## Steps
1. Ask user for scope if not specified (full sweep or specific area)
2. Read all files in scope
3. Hunt for: dead code, missing error handling, missing loading/empty states, hardcoded values, inconsistent patterns, potential bugs
4. Write findings to a report file (max 30 findings)
5. Deduplicate against existing bug tracker
6. Prioritize: P0 (crash), P1 (data loss), P2 (UX issue), P3 (tech debt)

## Rules
- NEVER modify source code
- Cap at 30 findings per sweep
- Check existing bug tracker before adding duplicates

