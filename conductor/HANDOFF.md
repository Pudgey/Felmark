# Session Handoff — 2026-03-30 (Late Evening)

## What just happened

Two parallel sessions ran: claude-main (this session) did drawing block + editor hardening, codex-main did polish packs.

### Claude-main: Drawing block + editor hardening

#### New: `/drawing` block (8 visual component types)
- Files: `drawing/DrawingBlock.tsx` (691 lines), `drawing/DrawingBlock.module.css` (570 lines)
- Sub-picker pattern (same as graph/money): `/drawing` → picks type → inserts
- Components: Flowchart, User Flow, Device Frames, Sitemap Tree, Sticky Notes, Sketch Chart, Stamps, Wireframe Kit

#### Hardened: Drag-and-drop for all block types
- `wrapBlock()` helper inside `renderBlock` — all block renders use it now
- Chrome fix: added `e.dataTransfer.setData()` (was causing silent drag failure)

#### Hardened: Slash menu viewport positioning
- Viewport-relative coordinates instead of editor-relative
- Flips above when not enough space below (was rendering off-screen below tall blocks)

#### Hardened: Empty block focus + placeholder
- CSS `:empty` replaced with `.is-empty` class (strips zero-width chars)
- `focusNew()` retry helper replaces all `setTimeout(20)` fire-and-forget patterns

#### Added: Click on empty space → new block
#### Added: Outline sidebar right-click context menu (Go to block, Delete block)

### Codex-main: Polish packs
- Slash menu ranking fix
- Template card hover/selected state fix
- Share modal error handling + clipboard fallback
- Rail icon tooltips
- Micro-polish audit
- Editor polish pack (autosave, focus clarity, insert cues) — may still be in progress

## Gotchas

- **`wrapBlock()`** is the canonical way to render blocks — never manually build blockRow+gutter
- **`focusNew(nid)`** replaces all setTimeout+blockElMap patterns for new block creation
- **Slash menu** uses viewport coordinates now — don't add scrollTop offsets
- **`is-empty` class** on contentEditable — call `syncEmpty()` after direct innerHTML manipulation
- **GUARDRAIL.md** was added by Codex — new ground rule requires updating it on every feature/block change
- **Drawing block** components are read-only for now (no inline editing of nodes/text)
