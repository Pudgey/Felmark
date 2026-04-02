Run the Project Grounding Protocol before making changes.

Follow `conductor/skills/brain/PROTOCOL.md`.

**Steps:**
1. Load project identity — Read CLAUDE.md for ground rules and architecture
2. Load current state — Read ACTIVE_CONTEXT.md, THOUGHTS.md, HANDOFF.md
3. Load structural context — Read GUARDRAIL.md (features, metrics) and FORGE_MAP.md (dependencies, hotspots, block registry)
4. Load standards — Read relevant engineering standards for the task at hand
5. Read the code — Read every file you plan to modify AND every file that imports them. Read the MANIFEST.md of every folder you plan to touch.
6. Acknowledge — State back the architecture anchors and hard constraints
7. Propose — State your plan before touching code. Wait for approval.
8. Checkpoint — Commit before first edit
9. Execute — One file at a time, analyze after each edit. Update MANIFEST.md of any folder where exports/deps/importers changed.

**Hard Constraints:**
- Do NOT add or remove packages without explicit human approval
- Do NOT modify more than 5 files per concern without checkpointing
- Run the project's analyzer/linter after every file edit
- Do NOT touch files outside the scope of the assigned task
- Every component folder MUST have a MANIFEST.md — create or update it in the same pass as code changes

**Emergency Abort:** If modifying more than 10 files, changing dependencies, or fighting the linter with suppressions — STOP, commit what you have, and let the human decide.
