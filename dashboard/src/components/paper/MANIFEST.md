# paper/

Paper — document-style view for blocks, designed for client-facing proposals. First-class rail surface that owns its own blocks state.

## Exports

| Export | File | Description |
|--------|------|-------------|
| `Paper` (default) | `Paper.tsx` | Main paper component — owns blocks state, renders document layout with outline |
| `PaperOutline` (default) | `PaperOutline.tsx` | Dedicated outline sidebar with section status, word counts, health ring |

## Dependencies

| Dependency | Source |
|------------|--------|
| `Block`, `BlockType`, `Workstation` | `@/lib/types` |
| `convertBlock`, `insertAfter`, `removeBlock` | `@/forge` |
| `SlashMenu` | `@/components/workstation/editor/chrome/slash-menu/SlashMenu` |

## Imported By

| Importer | What |
|----------|------|
| `views/forge.tsx` | `Paper` — rendered when `railActive === "forge"` |

## Architecture

Paper is a **state owner**, not a prop consumer. It receives `initialBlocks` on mount, copies them to local `useState`, and all edits happen locally. On close, it pushes the final state back via `onSave`. This eliminates the dual-cache mismatch that caused text flash/delete and outline desync.

## Files

| File | Lines | Purpose |
|------|-------|---------|
| `Paper.tsx` | ~470 | Paper shell, PaperBlock renderer (ref-based), local state, slash commands |
| `PaperOutline.tsx` | ~392 | Section builder, health ring, word bars, AI suggestions |
| `Paper.module.css` | ~201 | Paper layout, typography, block chrome, draft line |
| `PaperOutline.module.css` | ~97 | Outline panel, section items, status indicators |
