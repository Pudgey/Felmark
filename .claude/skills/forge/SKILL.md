Scan the codebase and rebuild the dependency map.

Follow `conductor/skills/forge/PROTOCOL.md`.

**Phases:**
1. **Scan** — Run file counts, import graphs, route discovery, block registry from actual disk (grep, find, wc). Never from memory.
2. **Diff** — Compare scan results against existing `conductor/FORGE_MAP.md`. Flag new files, deleted files, changed imports, stale entries.
3. **Update** — Regenerate `conductor/FORGE_MAP.md` with current scan data. Every path, count, and line number verified.
4. **Verify** — Confirm every file path in the map exists on disk. Confirm counts match. If anything fails, fix before shipping.

**Anti-hallucination rules:**
- Every path comes from `find` or `ls`, never from memory
- Every import count comes from `grep -c`, never estimated
- Every line number comes from `grep -n`, never approximated
- If a scan command fails, mark that section STALE — never fill from memory

**Cascading changes:**
- If the scan reveals a change that would cascade across 5+ files, generate a `/sprint` plan instead of executing directly
- Never batch more than 5 file changes without a build check

**When to run:**
- After any session that created or deleted files (mandatory)
- Before any refactor mission
- When the AI seems confused about file locations (stale map)
- Weekly as a health check
