# Sprint — Agent Team Coordination

Open multiple terminals, type /sprint in each — one becomes the planner, the rest become workers that self-assign from the sprint board.

## How It Works

### First Agent (becomes Planner)
1. Read DEVELOPMENT_BRIEF.md and codebase
2. Create `agent-sprint/SPRINT.md` with task list
3. Wait for human approval
4. Monitor progress as workers claim and complete tasks

### Subsequent Agents (become Workers)
1. Read `agent-sprint/SPRINT.md`
2. Find unclaimed task matching their capability
3. Claim via `mkdir claims/T-XXX`
4. Implement, commit, mark done
5. Pick up next unclaimed task

See `agent-team/agent-sprint/SPRINT_SOP.md` for full protocol.
