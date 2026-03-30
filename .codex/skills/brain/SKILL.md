---
name: "brain"
description: "Run the Project Grounding Protocol before making changes. Use when the user explicitly invokes $brain or asks for this workflow in Felmark."
---

# Brain — Project Grounding Protocol

Run the Project Grounding Protocol before making changes.

Follow `conductor/skills/brain/SKILL.md`.

## Steps
1. Load project identity — Read AGENTS.md for ground rules and architecture
2. Load current state — Read ACTIVE_CONTEXT.md, THOUGHTS.md, HANDOFF.md
3. Load standards — Read relevant engineering standards for the task at hand
4. Read the code — Read every file you plan to modify AND every file that imports them
5. Acknowledge — State back the architecture anchors and hard constraints
6. Propose — State your plan before touching code. Wait for approval.
7. Checkpoint — Commit before first edit
8. Execute — One file at a time, analyze after each edit

## Hard Constraints
- Do NOT add or remove packages without explicit human approval
- Do NOT modify more than 5 files per concern without checkpointing
- Run the project's analyzer/linter after every file edit
- Do NOT touch files outside the scope of the assigned task

## Emergency Abort
If modifying more than 10 files, changing dependencies, or fighting the linter with suppressions — STOP, commit what you have, and let the human decide.

