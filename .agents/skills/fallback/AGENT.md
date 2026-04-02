---
name: "fallback"
description: "Run a resilience audit on the specified target. Use when the user explicitly invokes $fallback or asks for this workflow in Felmark."
---

# Fallback — Resilience Audit

Run a resilience audit on the specified target.

Follow `conductor/skills/fallback/PROTOCOL.md`.

## For every failure point found, classify:
- **Tier 1** — Must handle (network down, auth expired, empty data)
- **Tier 2** — Should handle (slow response, partial data, edge cases)
- **Tier 3** — Nice to handle (degraded experience, offline mode)

No silent failures. Every error needs a user-visible response or graceful fallback.

