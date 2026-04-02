Run an accessibility audit on: $ARGUMENTS

Follow `conductor/skills/a11y/PROTOCOL.md`.

**Checks:**
- Semantic labels and ARIA attributes
- Color contrast (WCAG 2.1 AA minimum)
- Touch/click target sizes (44px minimum)
- Keyboard navigation and focus management
- Text scaling and zoom behavior
- Motion and animation preferences (prefers-reduced-motion)
- Form labels and error messages
- Screen reader compatibility

If no target is specified, ask the user what to audit.
