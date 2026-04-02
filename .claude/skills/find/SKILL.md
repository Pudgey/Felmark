Run a read-only codebase sweep on: $ARGUMENTS

Follow `conductor/skills/find/PROTOCOL.md`.

**Steps:**
1. Ask user for scope if not specified (full sweep or specific area)
2. Read all files in scope
3. Hunt for:
   - Dead code (unused functions, unreachable branches)
   - Missing error handling
   - Missing loading/empty states
   - Hardcoded values that should be constants
   - Inconsistent patterns
   - Potential bugs (race conditions, null access, type mismatches)
4. Write findings to a report file (max 30 findings)
5. Deduplicate against existing bug tracker
6. Prioritize: P0 (crash), P1 (data loss), P2 (UX issue), P3 (tech debt)

**Rules:**
- NEVER modify source code
- Cap at 30 findings per sweep
- Check existing bug tracker before adding duplicates
