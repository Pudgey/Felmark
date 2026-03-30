---
name: "bruteforce"
description: "Run a 5-agent adversarial codebase audit on the specified target. Use when the user explicitly invokes $bruteforce or asks for this workflow in Felmark."
---

# Bruteforce — 5-Agent Adversarial Audit

Run a 5-agent adversarial codebase audit on the specified target.

Follow `conductor/skills/bruteforce/SKILL.md`.

## Agents
1. **Schema** — Hunt data shape mismatches between layers
2. **Leak** — Find memory leaks, dangling listeners, uncleaned resources
3. **Async** — Race conditions, missing error handling, unguarded promises
4. **Ghost UI** — Dead components, unreachable states, phantom routes
5. **Rot** — Structural decay, circular deps, abstraction violations

Report findings with severity and suggested fixes.

