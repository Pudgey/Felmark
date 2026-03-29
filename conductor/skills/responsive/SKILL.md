---
name: responsive
description: Responsive layout and overflow audit -- one screen per pass, hunt for fixed layouts that break on narrow/wide viewports, missing breakpoint adaptation, and text overflow under realistic data.
---

# Responsive -- Layout & Overflow Audit

Audit a single screen for responsive layout correctness across viewport sizes. Hunt for fixed widths that overflow on narrow screens, layouts that waste space on wide screens, and text that clips with realistic data lengths. One screen per pass.

References:
- `packages/base_ux/` -- `UxBreakpoints` with responsive layout boundaries
- `packages/base_ui/` -- `BaseSpacing` (4px scale), `BaseRadius`, `BaseTypography`
- `CLAUDE.md` Ground Rules (design system tokens, const safety)
- `dev/conductor/standards/Flutter/FLUTTER_CHECKLIST.md`

---

## Global Rules

These apply to every responsive audit pass:

- **One screen per pass** -- never batch multiple screens
- **Declare target before starting** -- state the screen file path and its viewport context (full-page, tab content, modal, card)
- **`flutter analyze` after every change** -- zero new errors before moving to the next finding
- **No feature changes** -- layout fixes only, no functional changes
- **Preserve visual intent** -- the screen should look the same on the original viewport; it should also work on others
- **Commit after each completed pass** -- `git commit -m "responsive(<screen>): <summary>"`

---

## Step 0: Read the Screen

Open the target screen file and answer these questions before auditing:

1. **Layout approach**: Is the root a `Scaffold` > `SingleChildScrollView`, `CustomScrollView`, `Column`, `Stack`, or something else?
2. **Scroll axis**: Vertical-only? Horizontal sections inside vertical scroll? No scroll at all?
3. **Fixed dimensions**: Grep the file for `width:`, `height:`, `SizedBox(`, `Container(` with explicit pixel values.
4. **Breakpoint awareness**: Does the file import `UxBreakpoints`? Does it use `MediaQuery`, `LayoutBuilder`, or any conditional layout logic?
5. **Design token usage**: Are spacing values from `BaseSpacing.*` or hardcoded `EdgeInsets` with magic numbers?

Record the answers. They determine which audit steps are most relevant.

---

## Step 1: Fixed-Width & Overflow Audit

Hunt for layout code that assumes a specific viewport width and will overflow or clip on narrower screens.

**Hunt for:**
- [ ] `Container` or `SizedBox` with hardcoded `width:` (e.g., `width: 350`) that is not inside a scrollable or constrained parent
- [ ] `Row` children without `Flexible`, `Expanded`, or `Wrap` -- will overflow when children exceed row width
- [ ] `Padding` with large horizontal values (e.g., `EdgeInsets.symmetric(horizontal: 24)`) that eats too much space on 320px viewports
- [ ] Horizontal `ListView` or `SingleChildScrollView(scrollDirection: Axis.horizontal)` items with fixed widths that leave no room on small screens or look sparse on large screens
- [ ] `Stack` with `Positioned` using fixed `left`/`right` values that overlap or clip on narrow viewports
- [ ] Bento grid or multi-column layouts using fixed column counts without breakpoint adaptation
- [ ] `ConstrainedBox` or `Container` with `constraints: BoxConstraints(minWidth: X)` where X is too large for mobile

**Evidence required:** File path, line number, the fixed value, and what breaks (overflow, clipping, or wasted space).

### Fix Patterns

```dart
// BEFORE: Fixed width overflows on narrow screens
Container(width: 350, child: content)

// AFTER: Constrained max, flexible min
ConstrainedBox(
  constraints: const BoxConstraints(maxWidth: 350),
  child: content,
)

// BEFORE: Row children overflow
Row(children: [Icon(...), Text(longString), Button(...)])

// AFTER: Text flexes to available space
Row(children: [Icon(...), Expanded(child: Text(longString, overflow: TextOverflow.ellipsis)), Button(...)])

// BEFORE: Fixed padding eats small screens
Padding(padding: EdgeInsets.symmetric(horizontal: 24))

// AFTER: Responsive padding
Padding(padding: EdgeInsets.symmetric(horizontal: BaseSpacing.md)) // 12px
// Or scale with viewport:
// padding: EdgeInsets.symmetric(horizontal: screenWidth < 360 ? BaseSpacing.sm : BaseSpacing.lg)
```

---

## Step 2: Fixed-Height & Clipping Audit

Hunt for fixed heights that clip content on small screens or when text scales up.

**Hunt for:**
- [ ] `SizedBox(height: N)` wrapping content that could exceed N pixels (cards, tiles, headers)
- [ ] `Container` with explicit `height:` containing `Text` widgets that may wrap to multiple lines
- [ ] `ClipRect` or `ClipRRect` hiding overflow instead of letting content flow
- [ ] Hero/header sections with fixed heights that push content off-screen on short viewports (e.g., landscape phones, split-screen)
- [ ] Bottom sheets or modals with `height: MediaQuery.of(context).size.height * 0.8` that don't account for keyboard
- [ ] `AspectRatio` widgets that become too tall on wide screens or too short on narrow screens without constraints

**Evidence required:** File path, line number, fixed height value, and what content gets clipped.

### Fix Patterns

```dart
// BEFORE: Fixed height clips wrapped text
SizedBox(height: 80, child: Text(longDescription))

// AFTER: Min height with flexible growth
ConstrainedBox(
  constraints: const BoxConstraints(minHeight: 80),
  child: Text(longDescription),
)

// BEFORE: Modal ignores keyboard
Container(height: MediaQuery.of(context).size.height * 0.8)

// AFTER: Account for keyboard + safe area
Container(
  constraints: BoxConstraints(
    maxHeight: MediaQuery.of(context).size.height
      - MediaQuery.of(context).viewInsets.bottom
      - MediaQuery.of(context).padding.top
      - 100, // breathing room
  ),
)
```

---

## Step 3: Breakpoint Compliance

Check whether the screen adapts its layout at `UxBreakpoints` boundaries for multi-platform support.

**Check for:**
- [ ] Does the screen import and reference `UxBreakpoints`? If not, does it need to? (Full-page screens: yes. Small widgets inside a scrollable: probably not.)
- [ ] Are there `MediaQuery.of(context).size.width` calls? Do they use breakpoint constants or magic numbers?
- [ ] Is there a `LayoutBuilder` for parent-relative sizing?
- [ ] On wide screens (>900px): does content stretch edge-to-edge unreadably, or is there a `maxWidth` constraint for readability?
- [ ] On narrow screens (<360px): does everything still fit without horizontal overflow?
- [ ] Multi-column layouts: do they collapse to single-column on narrow viewports?

**Breakpoint expectations:**
- Compact (<600px): Single column, full-width cards, stacked layouts
- Medium (600-900px): Optional 2-column, wider cards, more breathing room
- Expanded (>900px): Max-width content area (600-800px), centered or sidebar layout

### Fix Patterns

```dart
// Breakpoint-aware layout
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 900) {
      return _wideLayout();   // 2-col or max-width centered
    } else if (constraints.maxWidth > 600) {
      return _mediumLayout();  // wider cards, optional 2-col
    }
    return _compactLayout();   // single column, full width
  },
)

// Max-width wrapper for readability on wide screens
Center(
  child: ConstrainedBox(
    constraints: const BoxConstraints(maxWidth: 700),
    child: content,
  ),
)
```

---

## Step 4: Text Overflow & Realistic Data

Test that text renders correctly with realistic maximum-length data, not just "John" and "Austin."

**Hunt for:**
- [ ] `Text` widgets without `maxLines` + `overflow: TextOverflow.ellipsis` on user-generated content (names, titles, descriptions)
- [ ] City names: test with "Salt Lake City" (14 chars), "Truth or Consequences" (21 chars), "Washington, D.C." (16 chars)
- [ ] Provider/user names: test with "Christopher Rodriguez-Hernandez" (33 chars)
- [ ] Category names: test with "Photography & Videography" (25 chars)
- [ ] Listing titles: test with "Professional Deep Cleaning Service for 3-Bedroom Apartments" (60 chars)
- [ ] Price displays: test with "$10,000.00" and "$0.99" -- both extremes
- [ ] Timestamps: test with "2 hours ago" vs "September 15, 2026" format differences
- [ ] Badge/pill text without `Flexible` wrapper that pushes siblings off-screen

**Evidence required:** The text widget location, what data overflows it, and how it manifests (overflow yellow bars, clipping, pushing layout).

### Fix Patterns

```dart
// BEFORE: Unbounded text
Text(userName)

// AFTER: Bounded with ellipsis
Text(
  userName,
  maxLines: 1,
  overflow: TextOverflow.ellipsis,
)

// BEFORE: Text in Row without flex
Row(children: [
  Text(cityName),
  Text(stateName),
])

// AFTER: Flexible text
Row(children: [
  Flexible(child: Text(cityName, overflow: TextOverflow.ellipsis)),
  Text(stateName), // short, fixed
])
```

---

## Step 5: Web-Specific Checks

Since INDEP targets web as primary platform, verify web-specific layout concerns.

**Hunt for:**
- [ ] No `maxWidth` constraint on the outermost content area -- text lines stretch to 1920px, unreadable
- [ ] Mouse hover states missing on interactive elements (cards, buttons, links) -- no `MouseRegion` or `InkWell` hover color
- [ ] Scroll behavior: does `SingleChildScrollView` use `primary: true` correctly? Is there a scrollbar visible on web?
- [ ] Fixed mobile-width assumptions (e.g., `MediaQuery.of(context).size.width` used directly for card widths without clamping)
- [ ] Tooltip or hover-dependent UI that has no tap equivalent for mobile users
- [ ] Text selection: is user-generated content selectable with `SelectableText` or `SelectionArea`?

**Evidence required:** File path, line number, and the web-specific deficiency.

### Fix Patterns

```dart
// Max-width for readability on desktop
Scaffold(
  body: Center(
    child: ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 700),
      child: content,
    ),
  ),
)

// Hover feedback on cards
MouseRegion(
  cursor: SystemMouseCursors.click,
  child: InkWell(
    hoverColor: BaseColors.softPurple.withOpacity(0.05),
    onTap: () => ...,
    child: card,
  ),
)
```

---

## Severity Classification

Triage every finding before fixing:

| Severity | Definition | Examples |
|----------|-----------|---------|
| **P0** | Content hidden or clipped -- user cannot see or interact with data | Text cut off with no ellipsis and no scroll; button pushed off-screen; form field hidden behind keyboard |
| **P1** | Layout visibly broken -- user can see the content but the layout is wrong | Yellow/black overflow bars; overlapping widgets; cards stretching edge-to-edge on 1920px screen |
| **P2** | Suboptimal but functional -- user can complete their task | Excessive whitespace on tablet; padding too tight on small phones but content still visible; single-column on tablet where 2-col would be better |
| **P3** | Polish -- no functional impact | Missing hover states; scrollbar not visible on web; could use `FittedBox` for slightly better text scaling |

**Fix order:** P0 first, then P1, then P2. P3 only if time permits and scope allows.

---

## Execution Protocol

1. **Declare** -- State the screen file path and viewport context:
   > "Running **responsive** audit on `lib/screens/home/v4/v4_marketplace.dart` (full-page tab, vertical scroll with horizontal sub-lists)"

2. **Read** -- Step 0: Read the screen file completely. Record layout approach, scroll axis, fixed dimensions, breakpoint usage, and token usage.

3. **Audit** -- Run Steps 1-5 in order. For each step, list findings with severity:
   ```
   [P1] Line 47: Row with 3 children, no Flexible/Expanded. Overflows at <360px.
   [P0] Line 112: Container(width: 350) inside Column -- clips on iPhone SE (320px).
   [P2] Line 200: No maxWidth on root -- stretches to full browser width on desktop.
   ```

4. **Fix** -- Apply fixes in P0 > P1 > P2 > P3 order. One finding at a time.

5. **Verify** -- After each fix:
   ```bash
   flutter analyze lib/path/to/modified_file.dart
   ```

6. **Report** -- After completing the pass:
   - Screen audited (file path)
   - Layout approach identified
   - Total findings by severity (P0/P1/P2/P3)
   - Findings fixed (with file:line citations)
   - Findings deferred (with justification -- e.g., "requires breakpoint system not yet in place")
   - Systemic patterns discovered (note for journal if same pattern appears 3+ times)

7. **Commit**:
   ```bash
   flutter analyze
   git add <modified files>
   git commit -m "responsive(<screen-name>): <summary of layout fixes>"
   ```

---

## Anti-Patterns (Do NOT Do These)

| Anti-Pattern | Why It's Wrong | Do This Instead |
|-------------|---------------|----------------|
| Wrap everything in `Expanded` | Causes flex violations in non-flex parents | Only use `Expanded`/`Flexible` inside `Row`/`Column`/`Flex` |
| Replace fixed widths with `double.infinity` | Creates unbounded layouts in scrollables | Use `ConstrainedBox(maxWidth:)` or `Flexible` |
| Add `MediaQuery` checks everywhere | Over-engineering; most widgets should flex naturally | Use `LayoutBuilder` only where layout truly changes shape |
| Fix overflow by adding `SingleChildScrollView` around everything | Hides the real problem (content too wide) and nests scrollables | Fix the content width instead |
| Use `FittedBox` on large text blocks | Text becomes unreadably small | Use `maxLines` + `overflow` or restructure the layout |
| Hardcode breakpoint values | Magic numbers drift from `UxBreakpoints` | Import and reference `UxBreakpoints` constants |

---

## Verification Checklist

- [ ] Screen file read completely; layout approach documented
- [ ] Fixed-width audit complete (Step 1)
- [ ] Fixed-height audit complete (Step 2)
- [ ] Breakpoint compliance checked (Step 3)
- [ ] Text overflow tested with realistic max-length data (Step 4)
- [ ] Web-specific checks complete (Step 5)
- [ ] All P0 findings fixed
- [ ] All P1 findings fixed
- [ ] P2 findings fixed or deferred with justification
- [ ] `flutter analyze` -- 0 new errors
- [ ] Changes committed with `responsive(<screen>):` prefix
- [ ] Systemic patterns noted for journal if 3+ instances found
