---
name: "aas"
description: "Run a three-layer quality review on the specified target. Use when the user explicitly invokes $aas or asks for this workflow in Felmark."
---

# AAS — Three-Layer Quality Review

Run a three-layer quality review on the specified target.

Follow `conductor/skills/aas/SKILL.md` and `conductor/sops/AAS_SOP.md`.

## Layers
1. **Advocate** — Read the code fresh. List what it actually does (not what it should do).
2. **Adjudicate** — Compare against project standards. Flag deviations.
3. **Suitability** — Verify correctness, hunt hallucinated logic, check edge cases.

If no target is specified, ask the user what to review.

