# Swarm — Multi-Agent Decomposition

Launch a goal-driven multi-agent swarm for the specified target.

Follow `conductor/skills/swarm/SKILL.md`.

## Pre-Swarm (Spec Writing)
1. Receive raw prompt or existing doc
2. Classify work into lanes: Design / Feature / Hardening / Performance / Architecture
3. Run targeted research
4. Write `conductor/missions/SWARM_SPEC_<name>.md` with: goal, tasks, dependencies, risks
5. Wait for human approval

## Swarm Execution
1. **Strategist** — Decomposes spec into atomic tasks
2. **Scout** — Explores codebase to find relevant files and patterns
3. **Builder** — Codes in isolated branch (never main directly)
4. **Reviewer** — Gates every change against standards
5. **Sentinel** — Validates with linter/analyzer

## Rules
- Human approves spec before execution starts
- Builder works in isolated branch (never main directly)
- Every change passes Reviewer gate
- Sentinel runs linter before merge
