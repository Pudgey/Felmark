# forge/

The Forge Engine — Felmark's state management and business logic layer. Provides CRUD operations for workstations, projects, documents, and tabs. All mutations flow through Forge; components never modify state directly.

## Architecture

```
page.tsx → createForge(stateUpdater) → forge.workstations.create(...)
                                      → forge.projects.rename(...)
                                      → forge.documents.setBlocks(...)
                                      → forge.tabs.select(...)
```

`page.tsx` creates a single Forge instance with a state updater. Components receive handler callbacks that call Forge methods internally.

## Exports (index.ts)

| Export | Type | Description |
|--------|------|-------------|
| `createForge(state)` | function | Creates a Forge instance with all services |
| `Forge` | interface | Shape of the forge instance |
| `getBlockDefaults` | function | Default data for any block type |
| `convertBlock` | function | Change a block's type in-place |
| `insertAfter` | function | Insert a new block after a given block |
| `removeBlock` | function | Remove a block from a document |
| `createEmptyBlock` | function | Create a new empty block |
| `createEmptyDocument` | function | Create a new empty document (default blocks) |
| `needsTrailingParagraph` | function | Check if document needs a trailing paragraph |
| `needsPicker` | function | Check if a block type requires a picker UI |
| `ForgeState`, `ForgeContext`, `ForgeResult`, `ForgeSource`, `StateUpdater` | types | Core type definitions |

## Services

| File | Service | Description |
|------|---------|-------------|
| `services/workstations.ts` | `createWorkstationServices` | Create, toggle, archive, quickCreate, archiveCompleted |
| `services/projects.ts` | `createProjectServices` | Rename, archive, restore, togglePin, cycleStatus, setDue |
| `services/documents.ts` | `createDocumentServices` | setBlocks |
| `services/tabs.ts` | `createTabServices` | Select, close, reorder |
| `services/blocks/` | Block factories | `getBlockDefaults` + block type utilities |

## Block Factory Registry (services/blocks/)

| File | Block types covered |
|------|-------------------|
| `core.ts` | Master `getBlockDefaults` switch + shared utilities |
| `basic.ts` | paragraph, h1, h2, h3, bullet, numbered, todo, quote, divider, callout, code, image, embed, toggle |
| `content.ts` | deadline, canvas, audio, data-chips, columns |
| `collaboration.ts` | comment-thread, mention, question, feedback, decision, poll, handoff, signoff, annotation |
| `visual.ts` | timeline, flow, brand-board, mood-board, wireframe, pull-quote, hero-spotlight, kinetic-type, number-cascade, stat-reveal, value-counter, graph |
| `money.ts` | money (all sub-types) |
| `unique.ts` | pricing-config, scope-boundary, asset-checklist, decision-picker, availability-picker, progress-stream, dependency-map, revision-heatmap |
| `ai.ts` | ai-action |

## Imported By

| Consumer | What |
|----------|------|
| `app/page.tsx` | `createForge`, `StateUpdater` |
| `views/forge.tsx` | (via ForgePaper) `convertBlock`, `insertAfter`, `removeBlock` |
| `components/workstation/forge-paper/ForgePaper.tsx` | `convertBlock`, `insertAfter`, `removeBlock` |
