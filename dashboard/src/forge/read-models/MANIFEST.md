# read-models/

Surface-specific projections derived from Forge domains.

Read models are intentionally thin and opinionated. They exist so each surface can receive exactly the context it needs without turning domains into UI-shaped blobs.

## Planned Read Models

| File | Consumer | Purpose |
|------|----------|---------|
| `sidebar.ts` | `components/sidebar/` | Identity, urgency, shell-level counts, lightweight client health |
| `workspace.ts` | `components/workspace/` | Project and execution context for the operational surface |
| `workstation.ts` | `components/workstation/` | Focused document context, project status, lightweight finance cues |
| `finance.ts` | `components/workstation/finance/` and future finance surfaces | Full finance projection and payment health |

## Rules

- Read models may compose multiple domains.
- Read models do not mutate state.
- Read models never import another surface's components or local seed data.
- Keep each projection intentionally small; do not create a giant `ClientEverything` object.

## Design Intent

The shell should answer "where do I go next?"

The workspace should answer "what needs action?"

The workstation should answer "what context helps me do the work right now?"
