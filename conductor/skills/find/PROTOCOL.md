# Find — Read-Only Codebase Sweep

Hunt for bugs, dead code, missing states, and structural issues. Never modifies code — writes findings to a report file.

## Steps

1. Ask user for scope (full sweep or specific area)
2. Read all files in scope
3. Hunt for:
   - Dead code (unused functions, unreachable branches)
   - Missing error handling
   - Missing loading/empty states
   - Hardcoded values that should be constants
   - Inconsistent patterns
   - Potential bugs (race conditions, null access, type mismatches)
4. Write findings to `find.md` (max 30 findings)
5. Deduplicate against existing bug tracker
6. Prioritize: P0 (crash), P1 (data loss), P2 (UX issue), P3 (tech debt)

## Rules

- NEVER modify source code
- Cap at 30 findings per sweep
- Check existing bug tracker before adding duplicates
- Other agents should check find.md before modifying files — claim and fix findings while they're in the area
