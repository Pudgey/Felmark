---
name: a11y
description: Comprehensive accessibility audit protocol -- semantic labels, contrast, touch targets, screen readers, text scaling, motion, forms, and platform checks.
---

# A11Y -- Accessibility Audit Protocol

Systematic accessibility audit for the INDEP Flutter app targeting WCAG 2.1 AA across web, iOS, and Android.

Extends: `SUPER_HARDENING_SOP.md` Phase 6 | Related: `MISSION_ACCESSIBILITY_HARDENING.md`

---

## Severity Classification

| Level | Label | Definition | Action |
|-------|-------|------------|--------|
| **P1** | Blocks Users | Screen reader users cannot complete a core flow, element invisible to assistive tech | Fix before any release |
| **P2** | Degrades Experience | Wrong labels, poor contrast, undersized targets, jarring motion | Fix before public launch (M4) |
| **P3** | Best Practice | Decorative images announced, verbose labels, minor contrast issues | Fix during polish passes |

---

## Pre-Audit Baseline

```bash
SCOPE="lib/screens/"  # or lib/screens/<feature>/
cd /Users/donteennis/Indep/indep_app
echo "=== Semantics ===" && grep -rn "Semantics(" $SCOPE | wc -l
echo "=== GestureDetector/InkWell ===" && grep -rn "GestureDetector(\|InkWell(" $SCOPE | wc -l
echo "=== BaseTapScale total ===" && grep -rn "BaseTapScale" $SCOPE | wc -l
echo "=== semanticLabel ===" && grep -rn "semanticLabel:" $SCOPE | wc -l
echo "=== Image.asset ===" && grep -rn "Image\.asset(" $SCOPE | wc -l
echo "=== Image.network ===" && grep -rn "Image\.network(" $SCOPE | wc -l
echo "=== IconButton ===" && grep -rn "IconButton(" $SCOPE | wc -l
echo "=== tooltip ===" && grep -rn "tooltip:" $SCOPE | wc -l
echo "=== disableAnimations ===" && grep -rn "disableAnimations" $SCOPE | wc -l
echo "=== ExcludeSemantics ===" && grep -rn "excludeSemantics\|ExcludeSemantics" $SCOPE | wc -l
```

---

## Step 1: Semantic Labels Audit [P1/P3]

Every interactive custom widget must be identifiable by screen readers.

### Scan
```bash
grep -rn "GestureDetector(" $SCOPE                          # needs Semantics parent
grep -rn "InkWell(" $SCOPE                                  # needs Semantics parent
grep -rn "BaseTapScale(" $SCOPE | grep -v "semanticLabel"   # missing built-in label
grep -rn "BasePressableCard(" $SCOPE                        # no built-in semantics
grep -rn "BaseButton(" $SCOPE                               # verify label serves as accessible name
grep -rn "IconButton(" $SCOPE | grep -v "tooltip"           # missing tooltip
```

### INDEP base_ui Patterns

| Widget | Semantics Support | Fix |
|--------|------------------|-----|
| `BaseTapScale` | Built-in `semanticLabel` + `isButton` | Always set `semanticLabel: '...'` |
| `BasePressableCard` | **None** | Wrap: `Semantics(button: true, label: '...', child: ...)` |
| `BaseButton` | Visible `label` text, raw `GestureDetector` internally | Wrap with `Semantics(button: true)` if label is ambiguous |
| `BaseWabbit` | **None** | `ExcludeSemantics` if decorative, or add `semanticLabel` on parent |
| `GestureDetector` / `InkWell` | **None** | `Semantics(button: true, label: '...', child: ...)` |
| `IconButton` without `tooltip` | Partial | Add `tooltip: '...'` |
| Decorative widget | Adds noise | `ExcludeSemantics(child: ...)` |

---

## Step 2: Color Contrast Verification [P2/P3]

WCAG AA: **4.5:1** normal text, **3:1** large text (18sp+ or 14sp+ bold).

### INDEP Palette Quick Check
| Foreground | Background | Ratio | AA? |
|-----------|------------|-------|-----|
| `#6C5CE7` brandPrimary | `#FFFFFF` | ~4.6:1 | Barely passes |
| `#A29BFE` brandAccent | `#FFFFFF` | ~2.7:1 | **Fails** -- large text only |
| `#333333` textPrimary | `#F8F9FA` bgPrimary | ~11.5:1 | Yes |
| `#FFFFFF` | `#6C5CE7` brandPrimary | ~4.6:1 | Barely passes |

### Scan for Danger Zones
```bash
grep -rn "withOpacity\|withValues(alpha:" $SCOPE | grep -i "text\|label\|title"
grep -rn "textInverse\|Colors.white" $SCOPE
grep -rn "textMuted" $SCOPE | wc -l
```

**Known risks**: `textMuted` on off-white bg, light purple accent as body text, white text on MeshGradient backgrounds, white text on category card accents.

---

## Step 3: Touch Target Sizing [P1/P2]

Minimum **48x48 dp** (Material) / **44x44 pt** (Apple HIG).

### Scan
```bash
grep -rn "SizedBox(\|width:\|height:" $SCOPE | grep -E "(24|28|32|36|40)" | head -30
grep -rn "GestureDetector" $SCOPE -A 3 | grep "Icon("
grep -rn "FilterChip\|ChoiceChip\|ActionChip" $SCOPE
```

**Common INDEP violations**: Small X/close buttons in sheets, icon-only trailing actions in list tiles, star rating taps, inline "See All" links, filter chips.

### Fix
```dart
// Expand hit area to 48dp with opaque behavior
GestureDetector(
  onTap: _close,
  behavior: HitTestBehavior.opaque,
  child: SizedBox(width: 48, height: 48, child: Center(child: Icon(Icons.close, size: 24))),
)
```

---

## Step 4: Screen Reader Navigation Order [P1/P2]

### Scan
```bash
grep -rn "FocusNode\|FocusScope\|FocusTraversalGroup" $SCOPE
grep -rn "ModalBarrier\|AbsorbPointer\|IgnorePointer" $SCOPE
grep -rn "OverlayEntry\|showDialog\|showModalBottomSheet" $SCOPE
grep -rn "sortKey\|OrdinalSortKey" $SCOPE
```

### Rules
1. Top-to-bottom, left-to-right (default) -- override with `OrdinalSortKey` only when necessary
2. No focus traps -- every modal/overlay needs escape (close button, barrier dismiss, back gesture)
3. Skip decorative elements -- `ExcludeSemantics`
4. Group related content -- `MergeSemantics` for label+value pairs

**INDEP concerns**: Floating nav in home_v4, auto-cycling spotlight/story cards interfering with focus, stacked bottom sheets in announcement detail, filter/sort sheets needing accessible dismiss.

---

## Step 5: Text Scaling Support [P2/P3]

UI must remain usable at **200%** system text scale without clipping.

### Scan
```bash
grep -rn "height:" $SCOPE | grep -v "SizedBox.shrink\|Skeleton\|Divider" | head -40
grep -rn "ClipRect\|ClipRRect\|overflow:" $SCOPE | head -20
```

### Rules
- Never use fixed height containers for text -- use `minHeight` or let content size naturally
- Use `maxLines` + `TextOverflow.ellipsis` instead of height clipping
- `BaseTypography.*` scales automatically via Flutter `TextScaler`
- Test: `MediaQuery(data: MediaQuery.of(context).copyWith(textScaler: TextScaler.linear(2.0)), child: ...)`

**INDEP high-risk**: Quick links grid tiles, category chips, bento grid overlays, marketplace listing cards, bottom nav bar.

---

## Step 6: Motion Sensitivity [P2]

Respect `MediaQuery.disableAnimationsOf(context)` for vestibular disorders.

### Scan
```bash
grep -rn "AnimationController(" $SCOPE | wc -l
grep -rn "disableAnimations" $SCOPE | wc -l
grep -rn "Timer.periodic\|\.repeat()" $SCOPE
```

### base_ui Already Handles
`BaseTapScale`, `BasePressableCard`, `FloatingParticles`, `EmptyState` -- all check `disableAnimations`.

### Audit These (Not Yet Handled)
- Spotlight card auto-cycling (`v4_spotlight_cards.dart`) -- should pause/snap
- Story card carousel (`v4_story_card.dart`) -- should stop auto-advance
- MarketplaceMarquee -- should stop scrolling
- Post flow MeshGradient animation -- should freeze
- Post flow step transitions -- should be instant

### Fix Pattern
```dart
final reduceMotion = MediaQuery.disableAnimationsOf(context);
if (reduceMotion) return _buildStaticContent();
return _buildAnimatedContent();
```

---

## Step 7: Image Alt Text [P2/P3]

### Scan
```bash
grep -rn "Image\.asset(" $SCOPE -A 3 | grep -B 3 "Image\.asset" | grep -v "semanticLabel"
grep -rn "Image\.network(" $SCOPE -A 3 | grep -B 3 "Image\.network" | grep -v "semanticLabel"
grep -rn "DecorationImage(" $SCOPE
grep -rn "BaseWabbit(" $SCOPE
grep -rn "CircleAvatar\|ClipOval" $SCOPE | head -20
```

### Classification
| Image Type | Action |
|------------|--------|
| Content (avatar, listing photo) | `semanticLabel: '${user.name} profile photo'` |
| Decorative (bg pattern, gradient) | `ExcludeSemantics(child: ...)` |
| Functional (tappable avatar) | `Semantics(button: true, label: '...', child: ...)` |
| Wabbit mascot | `semanticLabel` on parent or `ExcludeSemantics` if decorative |

---

## Step 8: Form Accessibility [P1/P2]

### Scan
```bash
grep -rn "TextField(\|TextFormField(" $SCOPE -A 10 | grep -B 5 "decoration:" | head -40
grep -rn "TextEditingController" $SCOPE | wc -l
grep -rn "Form(" $SCOPE | wc -l
grep -rn "validator:\|InputValidator\." $SCOPE | wc -l
```

### Rules
1. Every TextField needs accessible label (`labelText`, `hintText`, or wrapping `Semantics`)
2. Errors via `errorText:` in `InputDecoration` (auto-announced by Flutter)
3. Required fields indicated visually AND semantically
4. Submit feedback: `SemanticsService.announce('Success message', TextDirection.ltr)`

### INDEP Forms to Audit
Auth screens, write_review (star rating needs semantic value), edit_listing, new_event/new_listing post flow, booking_request, settings screens.

### Star Rating Pattern
```dart
Semantics(
  value: '$_rating out of 5 stars',
  onIncrease: () => setState(() => _rating = (_rating + 1).clamp(1, 5)),
  onDecrease: () => setState(() => _rating = (_rating - 1).clamp(1, 5)),
  child: _buildStarRow(),
)
```

---

## Step 9: Platform-Specific Considerations [P2]

### iOS (VoiceOver)
```bash
grep -rn "Dismissible\|SwipeAction" $SCOPE
grep -rn "onDoubleTap\|onPanUpdate\|onScaleUpdate" $SCOPE | wc -l
```
Custom swipe gestures need accessible alternatives (button/context menu). Test on real device.

### Android (TalkBack)
```bash
grep -rn "CustomPaint\|CustomPainter" $SCOPE
```
`CustomPaint` needs `Semantics` wrapper. `Semantics` works identically for TalkBack and VoiceOver.

### Web (ARIA / Keyboard)
```bash
grep -rn "FocusNode\|onKey:\|KeyboardListener" $SCOPE
grep -rn "MouseRegion\|onHover" $SCOPE | wc -l
```
Missing `Semantics` = missing ARIA roles. Tab key must reach all interactive elements. Enter/Space activates buttons. Escape closes modals. Test: Chrome DevTools Accessibility tab.

---

## Verification & Reporting

Re-run baseline scans, compare before/after, generate report:

| Category | Before | After | Delta |
|----------|--------|-------|-------|
| Semantics wrappers | X | Y | +N |
| semanticLabel on BaseTapScale | X | Y | +N |
| IconButton with tooltip | X | Y | +N |
| Images with semanticLabel | X | Y | +N |
| disableAnimations checks | X | Y | +N |
| Touch targets >= 48dp | X% | Y% | +N% |

**Sign-Off**: All P1 resolved | P2 resolved or in FIX_MANIFEST | P3 logged | `flutter analyze` clean | Screen reader tested | 200% text scale tested

### Cross-References
`SUPER_HARDENING_SOP.md` Phase 6 (this skill expands it) | `MISSION_ACCESSIBILITY_HARDENING.md` (active tracking) | `EXPORT_PROTOCOL.md` (verify on new screens) | `BRUTEFORCE_SOP.md` UX Pessimist (flags a11y gaps)
