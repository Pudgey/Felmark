---
name: "a11y"
description: "Run an accessibility audit on the specified target. Use when the user explicitly invokes $a11y or asks for this workflow in Felmark."
---

# A11y — Accessibility Audit

Run an accessibility audit on the specified target.

Follow `conductor/skills/a11y/SKILL.md`.

## Checks
- Semantic labels and ARIA attributes
- Color contrast (WCAG 2.1 AA minimum)
- Touch/click target sizes (44px minimum)
- Keyboard navigation and focus management
- Text scaling and zoom behavior
- Motion and animation preferences (prefers-reduced-motion)
- Form labels and error messages
- Screen reader compatibility

If no target is specified, ask the user what to audit.

