# Redesign — Prototype-First Redesign Planning

Use this protocol for structural UI changes that should be designed and specified before implementation.

## Goal

Turn a redesign idea into a grounded, reviewable plan before any production UI work begins.

## Steps

1. **Scan the redesign prototype**
   - Collect the source material first: screenshots, attached images, pasted JSX/CSS, Figma exports, or verbal layout descriptions.
   - Identify what is core versus decorative:
     - primary navigation
     - hierarchy
     - major panels/rails
     - interaction cues
     - typography, density, and tone
   - Name the target surface clearly:
     - what is being redesigned
     - what existing surface it affects
     - whether it replaces, extends, or coexists with current UI

2. **Capture the prototype in `Prototype/`**
   - Recreate the redesign as a standalone reference in `Prototype/` if it is not already preserved in the repo.
   - This prototype is a design artifact, not production code.
   - Keep it isolated from `dashboard/src/`.
   - Purpose of this step:
     - preserve the intended visual/system idea
     - make discussion concrete
     - prevent later implementation drift

3. **Scan the current product and code boundaries**
   - Read the current conductor state:
     - `conductor/ACTIVE_CONTEXT.md`
     - `conductor/HANDOFF.md`
     - `conductor/GUARDRAIL.md`
   - Read the target surface and its boundaries:
     - the actual files that currently render the surface
     - the relevant `MANIFEST.md` files
     - any parent shell or routing files that own layout
   - Identify:
     - current owner surface
     - adjacent surfaces that might be affected
     - existing shell/editor/data boundaries
     - what is real today versus mocked/demo-only

4. **Interrogate requirements with deep questions**
   - Do not move to planning while these are ambiguous.
   - Mandatory question areas:
     - **Purpose**
       - What job is this redesign solving?
       - What is broken in the current experience?
     - **Ownership**
       - Which surface owns this UI?
       - Is this shell chrome, local editor chrome, or a separate feature surface?
     - **Replacement**
       - What existing UI is being replaced?
       - What must remain?
       - What moves elsewhere?
     - **Hierarchy**
       - What is primary?
       - What is supportive?
       - What should never compete with the primary element?
     - **Data truth**
       - What data is real now?
       - What content in the prototype is aspirational, fake, or future-facing?
     - **States**
       - What are the required states?
       - collapsed / expanded
       - empty / populated
       - split view
       - terminal open
       - comment/review active
       - resize behavior
       - mobile/tablet behavior if relevant
     - **Success**
       - What should feel obviously better when this redesign lands?
       - What should be easier or clearer within 2 seconds?
   - If major product decisions remain unresolved, stop and get answers before planning.

5. **Write the redesign spec in `conductor/`**
   - Create the spec under `conductor/` at an appropriately named path.
   - The spec should include:
     - redesign goal
     - target surface and ownership
     - replace vs retain map
     - information hierarchy
     - interaction model and required states
     - real data vs aspirational data
     - affected files/surfaces
     - constraints and non-goals
     - open questions
   - This spec is the product contract for implementation.

6. **Create the comprehensive implementation plan**
   - Break implementation into phases or tranches.
   - Each tranche should be:
     - scoped
     - verifiable
     - small enough to checkpoint cleanly
   - The plan should include:
     - order of operations
     - affected files per tranche
     - verification strategy
     - migration risks
     - rollback or fallback considerations if relevant

7. **Stop for approval**
   - Present:
     - the prototype capture
     - the redesign spec
     - the implementation plan
   - Wait for approval before production implementation.

## Rules

- Call it a **redesign** when hierarchy, ownership, shell structure, or interaction model changes.
- Do not describe structural UI changes as “just a refactor.”
- No production implementation in `dashboard/src/` before the redesign spec is approved.
- Prototype code in `Prototype/` must stay isolated from production code.
- Never silently invent product decisions to fill gaps in a prototype.
- Always call out fake/demo data separately from real/current data.
- If the redesign touches shell ownership, route ownership, or editor chrome boundaries, state that explicitly in the spec.

## Deliverables

Before implementation starts, this skill should produce:
1. A prototype reference in `Prototype/` when needed
2. A redesign spec in `conductor/`
3. A comprehensive implementation plan
4. A list of unresolved product questions, if any remain
