# Optimize — Multi-Mode Strategy Engine

Generate hypotheses and improvement plans from data, codebase sweeps, audience research, or action simulation.

## Modes

### Mode 1: Data Analysis
Input: metrics, logs, analytics data
Output: prioritized hypothesis backlog based on what the data shows

### Mode 2: Codebase Sweep
Input: specific area or full codebase
Output: performance bottlenecks, architectural improvements, dead code

### Mode 3: Audience Research
Input: target audience description
Output: UX improvements, feature gaps, competitor analysis

### Mode 4: Action Simulation
Input: proposed change
Output: predicted impact, risks, second-order effects

### Mode 5: Autopilot
Input: broad goal
Output: runs modes 1-4 in sequence, produces comprehensive plan

## Rules

- Always produce a prioritized backlog (not just a list)
- Each hypothesis has: what, why, expected impact, effort estimate
- Never implement during optimize — only propose
- Human approves before any changes
