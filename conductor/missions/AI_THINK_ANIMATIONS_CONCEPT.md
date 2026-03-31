# AI Think Animations — Never Instant, Always Earned

**Created**: 2026-03-31
**Type**: Concept / Integration Target

---

## Concept

Every AI response in the terminal should feel like the AI is actively working — not just waiting for a server response. The pause is the product. Seven animation primitives combine into a full response sequence.

## The Seven Primitives

1. **Thinking Dots** — three bouncing dots. Quick lookups under 2s.
2. **Scanning Line** — gradient sweep across content. Reading/processing.
3. **Streaming Text** — characters appear one by one with blinking cursor.
4. **Skeleton Blocks** — content-shaped pulsing placeholders.
5. **Progress Phases** — numbered steps → spinner → green check. Multi-step processing.
6. **Waveform Pulse** — audio-style bars that pulse during computation.
7. **Full AI Response** — the complete sequence: dots → phases + waveform → streaming text + scan line → structured data card with actions.

## The Full Sequence

```
Think (800ms) → Phases + Waveform → Stream Answer → Structured Data + Actions
```

This is how every ambient nudge, NL query response, and alert should animate in the terminal.

## Prototype Reference

Full standalone prototype with all 7 primitives + showcase. Inline styles to convert to CSS modules.
