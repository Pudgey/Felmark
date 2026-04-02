# Canvas Premium Block Guardrails

These rules exist to stop premium workstation blocks from shipping with clipped layouts, redundant shells, or decorative elements that break the canvas.

## Layout

- A premium block must fit cleanly inside its declared default height with no clipping and no internal scrollbars.
- If a block needs more room than its target size allows, increase `defaultH` and `minH` or cut lower-priority content before shipping.
- A `4x5` or `5x5` premium block should have at most three major vertical zones.
- Optional actions belong in the block chrome, a secondary modal, or a follow-up state before they become a permanent fourth content zone.

## Surfaces

- The canvas block shell owns the outer surface. Premium blocks should not add another full-card wrapper background around themselves.
- Nested surfaces are allowed only when they communicate real structure, such as a ticket, signal card, or focused spotlight.
- Decorative elements must never extend outside the block bounds unless they have been reviewed in the actual canvas.

## Tokens

- Do not rely on undefined theme tokens inside premium blocks.
- Any custom semantic color must use a real global token or an explicit fallback value.

## Review Rule

- Before shipping a premium block, review it at its minimum supported width and default height in the workstation canvas, not just as standalone JSX.
