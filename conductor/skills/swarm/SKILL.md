# Swarm — Goal-Driven Multi-Agent Workflow

Takes a raw goal, writes a structured spec, gets human approval, then decomposes into parallel agent tasks.

## Phases

### Pre-Swarm (Spec Writing)
1. Receive raw prompt or existing doc
2. Classify work into lanes: Design / Feature / Hardening / Performance / Architecture
3. Run targeted research (web search for UI, codebase reads for hardening)
4. Write `SWARM_SPEC_<name>.md` with: goal, tasks, dependencies, risks
5. Wait for human approval

### Swarm Execution
1. **Strategist** — Decomposes spec into atomic tasks
2. **Scout** — Explores codebase to find relevant files and patterns
3. **Builder** — Codes in worktree (isolated from main)
4. **Reviewer** — Gates every change against standards
5. **Sentinel** — Validates with linter/analyzer

### Variants
- `/swarm light` — Skips Scout + Sentinel (for small tasks)
- `/swarm spec <path>` — Feeds an existing spec directly (skips pre-swarm)

## Rules

- Human approves spec before execution starts
- Builder works in worktree (never main directly)
- Every change passes Reviewer gate
- Sentinel runs linter before merge
