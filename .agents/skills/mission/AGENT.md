---
name: "mission"
description: "Create a new feature mission plan for the specified target. Use when the user explicitly invokes $mission or asks for this workflow in Felmark."
---

# Mission — Feature Mission Plan

Create a new feature mission plan for the specified target.

Follow `conductor/skills/mission/PROTOCOL.md`.

## Steps
1. Create mission doc at `conductor/missions/MISSION_<NAME>.md` using `conductor/templates/mission_template.md`
2. Define goal (one sentence, user-focused)
3. List deliverables (specific, verifiable checkboxes)
4. List out-of-scope items (prevents scope creep)
5. Identify affected files (new + modified)
6. Reference applicable standards
7. Get human approval before implementation
8. Update `conductor/DEVELOPMENT_BRIEF.md` with the new mission

## Rules
- Each deliverable should be completable in one sitting
- If a deliverable takes more than 4 hours, split it
- **STOP -> PROPOSE -> WAIT** before expanding scope
- Update mission doc as deliverables are completed

If no feature is specified, ask the user what they want to build.

