---
name: "sprint"
description: "Start or join a sprint. Use when the user explicitly invokes $sprint or asks for this workflow in Felmark."
---

# Sprint — Agent Team Coordination

Start or join a sprint.

Follow `conductor/skills/sprint/SKILL.md` and `conductor/agent-team/agent-sprint/SPRINT_SOP.md`.

## If no sprint board exists (you are the Planner):
1. Read DEVELOPMENT_BRIEF.md and the codebase
2. Create `conductor/agent-team/agent-sprint/SPRINT.md` with a task list
3. Wait for human approval
4. Monitor progress as workers claim and complete tasks

## If a sprint board already exists (you are a Worker):
1. Read `conductor/agent-team/agent-sprint/SPRINT.md`
2. Find an unclaimed task matching your capability
3. Claim it via `mkdir conductor/agent-team/agent-sprint/claims/T-XXX`
4. Implement, commit, mark done
5. Pick up the next unclaimed task

If no goal is specified, ask the user what the sprint should accomplish.

