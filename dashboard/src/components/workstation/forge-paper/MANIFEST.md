# forge-paper/

Forge Paper — document-style view for blocks, designed for client-facing proposals. First-class rail surface that owns its own blocks state.

## Exports

| Export | File | Description |
|--------|------|-------------|
| `ForgePaper` (default) | `ForgePaper.tsx` | Main paper component — owns blocks state, renders document layout with outline |
| `ForgePaperOutline` (default) | `ForgePaperOutline.tsx` | Dedicated outline sidebar with section status, word counts, health ring |

## Dependencies

| Dependency | Source |
|------------|--------|
| `Block`, `BlockType`, `Workspace` | `@/lib/types` |
| `convertBlock`, `insertAfter`, `removeBlock`, `needsPicker` | `@/forge` |
| `SlashMenu` | `@/components/editor/slash-menu/SlashMenu` |

## Imported By

| Importer | What |
|----------|------|
| `editor/Editor.tsx` | `ForgePaper` — rendered when `railActive === "forge"` |

## Architecture

ForgePaper is a **state owner**, not a prop consumer. It receives `initialBlocks` on mount, copies them to local `useState`, and all edits happen locally. On close, it pushes the final state back via `onSave`. This eliminates the dual-cache mismatch that caused text flash/delete and outline desync.

## Files

| File | Lines | Purpose |
|------|-------|---------|
| `ForgePaper.tsx` | ~390 | Paper shell, PaperBlock renderer (ref-based), local state, slash commands |
| `ForgePaperOutline.tsx` | ~323 | Section builder, health ring, word bars, AI suggestions |
| `ForgePaper.module.css` | ~201 | Paper layout, typography, block chrome, draft line |
| `ForgePaperOutline.module.css` | ~97 | Outline panel, section items, status indicators |
