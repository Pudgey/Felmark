# Multi-Agent Workflow SOP

> **Version**: 1.0
> **Created**: 2026-03-24

## Purpose

Coordinate multiple AI agents working on the same codebase without collisions, duplicated work, or conflicting changes.

## Roles

| Role | Responsibility |
|------|---------------|
| **Main Agent** | Creates sprint board, analyzes codebase, reviews completed work |
| **Worker Agent(s)** | Claim and execute individual tasks from the sprint board |
| **Human** | Opens terminals, types `/sprint`, approves PRs, resolves conflicts |

## Golden Rules

1. **One file, one owner** — Never edit a file another agent is working on
2. **Claim before edit** — Use atomic filesystem claims (`mkdir`) before modifying any file
3. **Commit often** — Small commits, clear messages, one concern per commit
4. **Read before write** — Always read the file before editing to catch other agents' changes
5. **Worktree isolation** — Each agent works in its own git worktree when possible

## Collision Prevention

### Atomic Claims
```bash
# Claim a task (atomic — mkdir fails if already exists)
mkdir -p agent-sprint/claims/TASK-001
echo "agent-name" > agent-sprint/claims/TASK-001/OWNER

# Verify claim (write-then-verify pattern)
cat agent-sprint/claims/TASK-001/OWNER
# Must match your agent name
```

### Stale Cleanup
- Claims older than 2 hours without a DONE file are considered stale
- Next agent to finish a task releases stale claims
- Never force-release another agent's claim if it's less than 2 hours old

## Communication

Agents communicate through files, not chat:
- `THOUGHTS.md` — real-time status ("I'm working on X")
- `HANDOFF.md` — session-end context
- `agent-sprint/claims/` — task ownership
- `agent-sprint/completed/` — finished work
