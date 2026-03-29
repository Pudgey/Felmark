# Optimize — Multi-Mode Strategy Engine

Run the multi-mode strategy engine on the specified target.

Follow `conductor/skills/optimize/SKILL.md`.

## Modes (specify one, or defaults to most relevant)
- **data** — Input: metrics, logs, analytics. Output: prioritized hypothesis backlog.
- **sweep** — Input: specific area or full codebase. Output: performance bottlenecks, improvements, dead code.
- **audience** — Input: target audience. Output: UX improvements, feature gaps.
- **simulate** — Input: proposed change. Output: predicted impact, risks, second-order effects.
- **autopilot** — Input: broad goal. Runs all modes in sequence.

## Rules
- Always produce a prioritized backlog (not just a list)
- Each hypothesis has: what, why, expected impact, effort estimate
- Never implement during optimize — only propose
- Human approves before any changes
