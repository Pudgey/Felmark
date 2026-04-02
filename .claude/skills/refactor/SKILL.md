Run a safe incremental refactor on: $ARGUMENTS

Follow `conductor/skills/refactor/PROTOCOL.md`.

**Protocol:**
1. Snapshot — understand current behavior completely
2. Change — one concern per pass, minimal diff
3. Verify — confirm identical behavior after change
4. Commit — checkpoint before next pass

Do NOT combine multiple refactoring concerns. Do NOT change behavior.
