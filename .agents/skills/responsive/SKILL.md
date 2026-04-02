---
name: "responsive"
description: "Run a responsive layout audit on the specified target. Use when the user explicitly invokes $responsive or asks for this workflow in Felmark."
---

# Responsive — Layout Audit

Run a responsive layout audit on the specified target.

Follow `conductor/skills/responsive/PROTOCOL.md`.

## Hunt for:
- Fixed widths that break on narrow/wide viewports
- Text overflow with realistic data lengths
- Missing breakpoint adaptation
- Scroll behavior issues
- Touch target sizing on mobile viewports

One screen per pass. Test at 320px, 768px, 1024px, 1440px minimum.

