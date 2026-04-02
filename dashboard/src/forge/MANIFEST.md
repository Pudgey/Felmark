# forge/

Forge is Felmark's shared model and business logic layer. Domain-owned truth lives here; surfaces consume projections from here. `Workspace`, `Workstation`, `Sidebar`, and future portals must never become sources of truth for each other.

## Architecture

```
app/page.tsx
  → createForge(stateUpdater)
    → forge.services/*      current mutation layer
    → forge.domains/*       canonical business ownership
    → forge.read-models/*   surface-specific summaries
```

Current state:
- `index.ts` and `types.ts` are still the public app-facing forge facade.
- `services/` remains the live mutation layer for workstations, projects, documents, tabs, and block factories.
- `domains/` and `read-models/` are introduced in this pass as the long-term structure for shared truth and surface projections.

## Ownership Rules

- Domains own truth by business area, not by screen.
- Surfaces never import another surface to retrieve data.
- Read models may compose domain data, but they never mutate it.
- Stripe and payment state must live under the finance domain, nowhere else.
- `Sidebar` should read a shell summary, not calculate or own client finance directly.

## Public Forge Facade

| File | Role |
|------|------|
| `index.ts` | Public forge entrypoint used by the app today |
| `types.ts` | Shared forge state and updater types |
| `services/` | Current mutation services and block factories |
| `domains/` | Canonical business-domain ownership, introduced as structure contract |
| `read-models/` | Surface-specific summaries, introduced as structure contract |

## Current Services

| File | Service | Description |
|------|---------|-------------|
| `services/workstations.ts` | `createWorkstationServices` | Create, toggle, archive, quickCreate, archiveCompleted |
| `services/projects.ts` | `createProjectServices` | Rename, archive, restore, togglePin, cycleStatus, setDue |
| `services/documents.ts` | `createDocumentServices` | setBlocks |
| `services/tabs.ts` | `createTabServices` | Select, close, reorder |
| `services/blocks/` | Block factories | `getBlockDefaults` + block type utilities |

## Planned Domain Split

| Domain | Owns |
|--------|------|
| `workstations/` | Client/workstation identity and shell-level status |
| `projects/` | Project state, deadlines, phase, pinning, progress |
| `documents/` | Blocks and document lifecycle |
| `finance/` | Revenue, invoices, payments, outstanding, Stripe seams |

## Planned Read Models

| Read model | Purpose |
|-----------|---------|
| `sidebar.ts` | Identity + urgency + shell-level summary |
| `workspace.ts` | Operational client/project projection |
| `workstation.ts` | Document-adjacent context for focused work |
| `finance.ts` | Full finance-facing projection and payment health |

## Imported By

| Consumer | What |
|----------|------|
| `app/page.tsx` | `createForge`, `StateUpdater` |
| `views/forge.tsx` | (via ForgePaper) `convertBlock`, `insertAfter`, `removeBlock` |
| `components/workstation/forge-paper/ForgePaper.tsx` | `convertBlock`, `insertAfter`, `removeBlock` |
