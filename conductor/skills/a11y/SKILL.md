---
name: a11y
description: Accessibility audit protocol for Felmark's React and web surfaces: semantics, keyboard access, contrast, motion, forms, and responsive readability.
---

# A11Y -- Accessibility Audit Protocol

Systematic accessibility audit for Felmark's browser-based product. Target WCAG 2.1 AA across the dashboard and any extension UI.

References:
- `AGENTS.md`
- Relevant files in `dashboard/src/` or `extension/`

Severity levels:
- `P1`: blocks task completion for assistive-tech users
- `P2`: degrades usability materially
- `P3`: best-practice gap or minor polish issue

---

## Step 1: Scope the Surface

Audit one concrete surface per pass:

- A page
- A modal
- A feature area
- A specific interaction flow

Record:

1. File path
2. Route or entry point
3. Core user tasks

---

## Step 2: Semantics and Accessible Names

Check:

- Interactive controls use the correct HTML element first
- Buttons, links, dialogs, tabs, and menus have accessible names
- Icons that act as controls are labeled
- Decorative graphics are hidden from assistive tech
- Heading structure is meaningful and ordered

Useful scans:

```bash
rg -n "<button|<a |aria-|role=|tabIndex|alt=|title=" dashboard/src extension
```

Prefer semantic HTML over adding ARIA to divs that should have been buttons.

---

## Step 3: Keyboard and Focus

Check:

- Every interactive element is reachable by keyboard
- Focus order matches visual order
- Dialogs trap focus correctly and restore focus on close
- No hover-only interaction hides essential actions
- Focus styles are visible and not removed without replacement

Manual pass:

1. Tab through the target
2. Trigger the primary actions
3. Confirm escape/close behavior for overlays

---

## Step 4: Contrast and Visual States

Check:

- Text contrast meets AA targets
- Disabled, hover, selected, and error states remain legible
- Color is not the only signal for status
- Skeletons and placeholders do not erase structure or meaning

If the UI relies on color alone, require an icon, label, pattern, or text cue.

---

## Step 5: Motion and Reduced-Motion Support

Check:

- Meaningful animations respect reduced motion preferences
- Autoplay or marquee behavior can pause or degrade cleanly
- Motion does not hide state changes from users who disable it

Useful scan:

```bash
rg -n "prefers-reduced-motion|animation|transition|requestAnimationFrame" dashboard/src extension
```

---

## Step 6: Forms and Validation

Check:

- Inputs have labels
- Required fields are obvious before submit
- Validation errors are tied to the correct field
- Error text is specific and actionable
- Async submit state is announced visually and structurally

Audit create/edit/share/auth flows first because they carry the most risk.

---

## Step 7: Text Scaling and Responsive Readability

Check:

- Long labels do not clip on narrow screens
- Content still works under browser zoom and larger text
- Fixed-height containers do not hide important copy
- Tables, chips, and toolbars degrade cleanly on smaller widths

---

## Step 8: Screen Reader Sanity Pass

Do a targeted pass with available browser tooling:

- Confirm landmarks
- Confirm headings
- Confirm control names
- Confirm dialog announcements
- Confirm status/error updates where relevant

If you cannot run a full screen-reader pass, say so and document the remaining risk.

---

## Output Format

For each finding:

- Severity
- File and line
- User impact
- Evidence
- Fix recommendation

Findings come first. Summary second.

---

## Done Criteria

- Semantics, keyboard access, contrast, motion, forms, and text scaling were all checked
- Findings are prioritized by user harm
- Recommendations are concrete and valid for a web React codebase
