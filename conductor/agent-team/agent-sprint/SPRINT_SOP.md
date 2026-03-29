# Sprint Execution Protocol

## Creating a Sprint

1. Main agent reads the codebase and DEVELOPMENT_BRIEF.md
2. Creates `SPRINT.md` with task list (max 12 tasks per sprint)
3. Each task has: ID, description, priority, estimated file changes
4. Human approves the sprint board

## Working a Sprint

1. Agent reads `SPRINT.md`
2. Finds an unclaimed task matching their capability
3. Claims it: `mkdir claims/T-XXX && echo "agent-name" > claims/T-XXX/OWNER`
4. Verifies claim: `cat claims/T-XXX/OWNER` (must match)
5. Implements the task
6. Commits with message: `sprint(T-XXX): description`
7. Writes summary: `echo "summary" > completed/T-XXX.md`
8. Updates SPRINT.md status to `done`

## Sprint Lifecycle

```
Created → Active → Complete → Archived
```

- **Created**: Board written, awaiting human approval
- **Active**: Workers claiming and executing
- **Complete**: All tasks done or abandoned
- **Archived**: Moved to `completed/` directory with date prefix
