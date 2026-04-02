---
name: sop
description: Production readiness orchestrator for Felmark. Audit a screen or feature across product, UX, resilience, accessibility, security, and code quality.
---

# SOP -- Production Readiness Orchestrator

Use SOP when the question is not "what bug should I fix?" but "what stands between this surface and release?" SOP is the umbrella audit that reads the implementation, identifies missing pieces, and points to the specialized skill that should handle each gap.

References:
- `AGENTS.md`
- `CLAUDE.md`
- Relevant files under `dashboard/src/`, `extension/`, and `conductor/`

---

## Valid Targets

- A page
- A feature area
- A full workflow
- A full-app sweep, if explicitly requested

Audit one clear target at a time unless the user asked for a broader pass.

---

## Step 1: Scope and Confirm

Define:

1. What is being audited
2. Which files and routes are involved
3. What the user is trying to accomplish on that surface

If the target is ambiguous, narrow it before continuing.

---

## Step 2: Read the Actual Implementation

Read:

1. The route or entry point
2. The feature components
3. Relevant types and state management
4. Data access helpers
5. Adjacent shared UI used by the feature

Build a grounded model of how the feature works now, not how it was intended to work.

---

## Step 3: Evaluate the 10 Readiness Dimensions

For each dimension, record status, evidence, and next action.

1. Core workflow completeness
2. Loading, empty, and error states
3. Navigation and flow continuity
4. Responsive behavior
5. Accessibility
6. Resilience and fallback behavior
7. Security and trust boundaries
8. Microcopy and product voice
9. Code quality and maintainability
10. Product fit and missing affordances

---

## Step 4: Recommend the Right Specialist Skill

Map gaps to the correct follow-up skill:

- Accessibility -> `a11y`
- Resilience -> `fallback`
- Security -> `secure`
- Responsive issues -> `responsive`
- Micro-interaction issues -> `micro`
- Brand voice -> `tone`
- Code review concerns -> `review`
- End-to-end flow gaps -> `flow`
- Release hardening -> `polish`
- Structural cleanup -> `refactor` or `housekeeping`

If a gap does not need a separate skill, say so and keep it in the SOP output.

---

## Step 5: Produce a Readiness Output

The SOP result should include:

- What was audited
- Current strengths
- Findings by dimension
- Missing pieces
- Release risks
- Recommended next skills or fixes in priority order

Findings should be concrete enough that another agent could pick them up without re-discovering the issue.

---

## Output Style

Use a scorecard or table if it helps, but keep it decision-oriented:

- Pass
- At risk
- Blocked

Do not hide critical blockers behind an average score.

---

## Done Criteria

- The audit covers the full surface, not just code style
- Findings are grouped by decision value
- Recommendations point to Felmark-valid follow-up skills
