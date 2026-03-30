# Phase — Next Development Phase Proposal

Define the next development phase before implementation starts. A phase is larger than a single mission: it frames what the product should tackle next, why now, what must be true before work begins, and what approval is needed from the human.

## When to Use

- The current phase is complete or close enough that the next one needs to be framed
- The user wants to decide what comes next, not start building immediately
- Several possible directions exist and a clear recommendation is needed
- A mission would be too narrow because the next step spans multiple features or systems

## Goal

Produce a phase proposal the human can approve, reject, or reshape before any development begins.

## Steps

1. Read the current product state from `conductor/ACTIVE_CONTEXT.md`, `conductor/HANDOFF.md`, and relevant mission docs
2. Name the proposed next phase clearly and concretely
3. Define the phase objective in one sentence
4. Explain why this phase should happen now
5. List the user-facing outcomes the phase is meant to unlock
6. Define entry criteria: what must already be true before the phase starts
7. Define exit criteria: what must be true for the phase to count as complete
8. List likely missions or workstreams inside the phase
9. List dependencies, risks, and explicit out-of-scope items
10. End with a clear approval question for the human

## Output Format

Write the proposal to `conductor/missions/PHASE_<NAME>.md`.

The phase doc should include:

- Title
- Objective
- Why Now
- User Impact
- Entry Criteria
- Exit Criteria
- Proposed Missions or Workstreams
- Dependencies
- Risks
- Out of Scope
- Approval Question

## Rules

- Do NOT implement during `phase`
- Do NOT silently convert the phase into a mission or feature build
- Recommend one primary phase, not a vague menu of equal options
- Keep the scope strategic but concrete enough for approval
- If the next phase is unclear, present the uncertainty explicitly instead of pretending it is settled

## Approval Gate

`phase` always stops at proposal. The human must approve before mission planning or implementation begins.
