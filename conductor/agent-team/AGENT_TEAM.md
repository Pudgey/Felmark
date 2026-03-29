# Agent Team — Cross-Session Multi-Agent Coordination

## Concept

Multiple AI agents (Claude, Gemini, Codex, etc.) can work on the same project across sessions. This doc defines how they coordinate without stepping on each other.

## How It Works

1. **Human opens terminals** — one per agent
2. **Each agent runs `/sprint`** — one becomes the planner, the rest become workers
3. **Workers self-assign** from the sprint board using atomic claims
4. **Workers commit and mark done** when finished
5. **Planner reviews** and merges

## Sprint Board

Located at `agent-sprint/SPRINT.md`. Created by the main agent.

```markdown
# Sprint: <Name>

| ID | Task | Status | Owner | Priority |
|----|------|--------|-------|----------|
| T-001 | Description | open/claimed/done | agent-name | P0/P1/P2 |
```

## Claiming

```
agent-sprint/
├── SPRINT.md          ← The board
├── claims/
│   ├── T-001/OWNER    ← "claude-1" (claimed)
│   └── T-002/OWNER    ← "gemini-1" (claimed)
└── completed/
    └── T-003.md       ← Done summary
```

## Provider Preferences (Advisory)

| Task Type | Suggested Provider | Why |
|-----------|-------------------|-----|
| Engineering (code) | Claude | Strong at implementation |
| Thorough audits | Gemini | Good at comprehensive sweeps |
| Quick fixes | Any | Low risk, any agent can handle |

These are suggestions, not rules. Any agent can do any task.

## Stale Cleanup

- Claims >2 hours old without a DONE file → released by next agent
- Sprint boards >7 days old without activity → archived
