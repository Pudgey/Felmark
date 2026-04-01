Run the multi-mode strategy engine on: $ARGUMENTS

Follow `conductor/skills/optimize/SKILL.md`.

**Modes** (specify one, or defaults to the most relevant):
- **data** — Input: metrics, logs, analytics data. Output: prioritized hypothesis backlog.
- **sweep** — Input: specific area or full codebase. Output: performance bottlenecks, architectural improvements, dead code.
- **audience** — Input: target audience description. Output: UX improvements, feature gaps, competitor analysis.
- **simulate** — Input: proposed change. Output: predicted impact, risks, second-order effects.
- **autopilot** — Input: broad goal. Runs all modes in sequence, produces comprehensive plan.

**Rules:**
- Always produce a prioritized backlog (not just a list)
- Each hypothesis has: what, why, expected impact, effort estimate
- Never implement during optimize — only propose
- Human approves before any changes

Usage: `/optimize sweep src/components` or `/optimize audience first-time customers`
