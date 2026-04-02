---
name: responsive
description: Responsive layout audit for Felmark's web UI. Catch overflow, fragile toolbars, fixed-width assumptions, and poor small-screen adaptation.
---

# Responsive -- Layout & Overflow Audit

Audit one page, panel, modal, or feature surface for viewport resilience. Felmark is browser-native, so responsive correctness is a core quality bar, not a polish extra.

References:
- `AGENTS.md`
- Target files in `dashboard/src/` or `extension/`

---

## Global Rules

- One surface per pass
- No feature changes during a responsive pass
- Preserve the existing visual intent while making it work across widths
- Verify with both narrow and wide viewports

---

## Step 1: Read the Surface

Identify:

1. Route or entry point
2. Layout primitives used: grid, flex, split pane, sticky rail, modal, etc.
3. Expected dense areas: toolbars, chips, tabs, cards, editor controls

Look for likely failure points before editing.

---

## Step 2: Hunt Fixed Assumptions

Check for:

- Hardcoded widths or heights
- Toolbars that rely on one exact viewport
- Tables or panels that cannot shrink
- Sidebars that overlap content
- Cards that assume short titles or one-line metadata

Useful scans:

```bash
rg -n "width:|height:|min-width|minHeight|max-width|maxWidth|grid-template-columns|flex:" dashboard/src extension
```

---

## Step 3: Hunt Overflow and Density Problems

Check:

- Long workspace names
- Dense editor controls
- Date chips, tags, and badges
- Dialog actions on narrow screens
- Navigation rails and tab bars with too many items

Make sure text wraps, truncates, or reflows intentionally rather than spilling or disappearing.

---

## Step 4: Check Interaction Modes

Verify:

- Pointer and keyboard access both remain usable
- Sticky elements do not cover actionable content
- Scrolling regions do not fight each other
- Mobile viewport behavior still allows core actions without precision tapping

---

## Step 5: Verify

Run available verification:

```bash
npm run lint
npm run build
```

Then manually inspect the target at a minimum of:

- Narrow mobile width
- Tablet-ish width
- Desktop width

---

## Output Format

For each finding:

- File and line
- Viewport where it breaks
- What fails
- Recommended fix

---

## Done Criteria

- No obvious overflow or clipping remains
- Core tasks work at narrow and wide widths
- Guidance is valid for the web codebase, not a transplanted mobile checklist
