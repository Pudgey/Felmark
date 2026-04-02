# Brain — Project Grounding Protocol

Load the full project context into your working memory before making any changes. Prevents rogue rewrites, duplicate work, and architecture violations.

## Steps

1. **Load project identity** — Read the project's AI config file (CLAUDE.md, etc.) for ground rules and architecture
2. **Load current state** — Read ACTIVE_CONTEXT.md, THOUGHTS.md, HANDOFF.md, and bug tracker
3. **Load structural context** — Read GUARDRAIL.md (feature registry, codebase pulse) and FORGE_MAP.md (dependency map, hotspot files, block registry). These tell you what exists and what depends on what.
4. **Load standards** — Read relevant engineering standards for the task at hand
5. **Read the code** — Read every file you plan to modify AND every file that imports them. Read the MANIFEST.md of every folder you plan to touch — it declares exports, dependencies, and importers.
6. **Acknowledge** — State back the architecture anchors and hard constraints
7. **Propose** — State your plan before touching code. Wait for approval.
8. **Checkpoint** — Commit before first edit
9. **Execute** — One file at a time, analyze after each edit. Update MANIFEST.md of any folder where exports/deps/importers changed.

## Hard Constraints (Template — Customize Per Project)

1. I will NOT add or remove packages without explicit human approval
2. I will NOT modify more than 5 files per concern without checkpointing
3. I will run the project's analyzer/linter after every file edit
4. I will NOT touch files outside the scope of my assigned task

## Emergency Abort

If modifying more than 10 files, changing dependencies, or fighting the linter with suppressions — STOP, commit what you have, and let the human decide.
