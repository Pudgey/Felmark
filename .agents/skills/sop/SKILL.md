---
name: "sop"
description: "Run the production readiness orchestrator on the specified target. Use when the user explicitly invokes $sop or asks for this workflow in Felmark."
---

# SOP — Production Readiness Orchestrator

Run the production readiness orchestrator on the specified target.

Follow `conductor/skills/sop/PROTOCOL.md`.

## Audits across dimensions and delegates to specialized skills:
- Accessibility -> a11y
- Resilience -> fallback
- Security -> secure
- Responsiveness -> responsive
- Micro-interactions -> micro
- Brand voice -> tone
- Code quality -> review
- Polish -> polish

Produces a readiness scorecard with pass/fail per dimension.

