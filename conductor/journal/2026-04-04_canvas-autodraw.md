---
date: 2026-04-04
slug: canvas-autodraw
tags: [canvas, ai, feature, debug, editor]
agent: claude-main
---

# Canvas AI Autodrawer

## What happened

Designed and built an AI autodraw feature for the canvas block, then debugged three rendering issues and one key-collision crash that surfaced immediately after.

## Built

**`/api/canvas/route.ts`** — New POST endpoint that sends the user's sentence to `claude-haiku-4-5-20251001` with a slot-grid system prompt. LLM outputs a typed `AutodrawElement[]` (rect/circle/diamond/arrow/text with col/row indices, not pixel coordinates). Separate from `/api/generate` — different contract, different system prompt.

**`useAutodraw.ts`** — Hook managing prompt state, fetch lifecycle, and grid-to-pixel coordinate hydration. Accepts `allocateId` callback to avoid touching the module-level ID counter directly. Calls `pushUndo()` before stamping so output is fully undoable.

**`CanvasBlock.tsx`** — ✦ button in toolbar toggles an inline input. Canvas overlay shows `✦ Drawing…` with pulsing animation while generating.

## Bugs fixed post-build

**1. Text invisible** — Two causes: (a) shape labels were pushed adjacent to their shapes, then arrows were pushed after — arrows painted on top of labels in SVG order. Fixed by separating into three arrays (shapes → connectors → labels) so labels always paint last. (b) Arrows routed center-to-center, piercing through shapes. Fixed with ray-box intersection trim using per-shape-type half-dimensions.

**2. Circles looked terrible** — All shapes were using the same 120×48 rect dimensions. Circles rendered as flat wide ellipses. Fixed with per-type `DIMS` map: `rect 120×48`, `circle 60×60`, `diamond 90×60`. Arrow trimming now uses a `slotType` map to look up actual dimensions per node.

**3. Text tool only saved on Enter** — Root cause: `handleDown` (pointerdown event) called `setTextValue("")`. React re-renders from that update BEFORE `onBlur` fires, so the `submitText` closure captured `textValue = ""`. Fixed by saving the in-progress text inline at the top of the `tool === "text"` branch in `handleDown`, synchronously, before the state reset.

**4. Duplicate key crash** — `nextCanvasId` was a module-level `let` starting at 1. On page reload / HMR, it reset to 1 while persisted elements already had id=1. Fixed by deriving ids from the current persisted element set, repairing duplicate ids on read, and removing render-time ref reads from the canvas selection/cursor path.

## Verification

- `npm run lint` passes in `dashboard/`
- The canvas render path now keys all elements off repaired unique ids
- Undo/redo availability is state-backed instead of reading refs during render

## Patterns

- **Slot-grid prompting is reliable.** LLMs produce consistent spatial output when given named columns/rows instead of pixel coordinates. The hydration layer handles all geometry.
- **SVG paint order matters for text labels.** Never push labels immediately after their parent shape if connectors are emitted after. Always collect shapes/connectors/labels separately and concat.
- **Module-level counters break on HMR.** Any `let nextId = 1` at module scope will reset. Use a `useRef` initialized from existing data instead.
- **React event ordering trap.** Batched state updates from `pointerdown` apply before `blur` fires. Any `onBlur` handler that reads state will see the post-update value. Save synchronously in the earlier event handler instead of relying on blur.
