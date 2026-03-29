---
name: polish
description: Pre-release polish and hardening checklist -- apply when a feature hits 70% completion.
---

# Polish -- Pre-Release Polish & Hardening

Apply this checklist when a feature reaches **70% completion** -- meaning core logic is functional, navigation routes are registered, and data is flowing from Firestore to the UI. This is the finalization phase that transforms working code into shippable code.

Reference: `dev/conductor/standards/SUPER_HARDENING_SOP.md`

---

## Gate Condition

Before starting this skill, confirm:
- [ ] Core logic is functional and tested
- [ ] Navigation routes are registered
- [ ] Data is successfully flowing from Firestore to the UI

If any of these are false, finish the core work first. Do not polish incomplete features.

---

## Phase 1: UI/UX Polish (The "Soul")

Focus on the tactile and visual feel of the interface.

### Token Enforcement
- [ ] Zero hardcoded color values -- all colors use `BaseColors.*`
- [ ] Zero hardcoded text styles -- all text uses `BaseTypography.*`
- [ ] Zero hardcoded spacing values -- all spacing uses `BaseSpacing.*`
- [ ] Zero hardcoded radii -- all border radii use `BaseRadius.*`
- [ ] No `const` keyword on widgets referencing non-const base_ui tokens

### Motion and Easing
- [ ] All transitions use `Curves.easeOutQuart` or `Curves.easeInOutCubic`
- [ ] No raw `Curves.linear` on user-facing animations
- [ ] Transition durations are consistent (150-300ms for micro, 300-500ms for page)

### Placeholders and Skeletons
- [ ] Every async data point has a stable skeleton loader
- [ ] No layout shifts when data loads (skeleton must match data layout dimensions)
- [ ] Never use `SizedBox.shrink()` for loading state (causes layout collapse)

### Tactile Feedback
- [ ] Interactive elements have haptic feedback (`BaseHaptics` or `HapticFeedback`)
- [ ] Press states use `BaseTapScale` (not manual AnimationController for simple press)
- [ ] Cards use `BasePressableCard` for interactive cards

---

## Phase 2: System Hardening (The "Armor")

Focus on resilience and crash prevention.

### Async Guards
- [ ] `if (!mounted) return;` after every `await` in StatefulWidget or StateNotifier logic
- [ ] `if (!mounted) return;` inside every `Future.delayed` callback that accesses state
- [ ] `if (!mounted) return;` inside every `.then()` callback that calls `setState`

### Type Resilience
- [ ] All Firestore parsing uses safe casts (`as Type?` with fallback, not hard `as Type`)
- [ ] Timestamp handling uses `is Timestamp` check before cast
- [ ] `doc.id` is injected into map data before `fromMap()`

### Error States
- [ ] Every screen that loads data has an error state with a "Retry" button
- [ ] Error messages are user-friendly (not raw exception strings)
- [ ] Error states are visually distinct from empty states

### Boundary Checks
- [ ] Counters use `.clamp()` to prevent negative or absurd values
- [ ] Lists use `.take()` to prevent memory bloat from large datasets
- [ ] String inputs have max length limits

---

## Phase 3: Safety and Security (The "Shield")

Focus on preventing user error and data corruption.

### Double-Tap Protection
- [ ] All write/submit actions have `_isSubmitting` flag guard
- [ ] All navigation actions have `_isNavigating` flag or debounce
- [ ] Flags are reset in `finally` blocks (not just on success)

### Input Hardening
- [ ] All TextFields have `FilteringTextInputFormatter` where appropriate
- [ ] All TextFields have character limits (`maxLength`)
- [ ] All TextFields set all 3 borders explicitly (border, enabledBorder, focusedBorder)

### Permission Hygiene
- [ ] OS permissions (camera, location) are requested contextually, never automatically
- [ ] No browser prompts fire on app launch (use 2-second delay or user-initiated)

---

## Phase 4: Accessibility (The "Inclusion")

Focus on screen readers and varied device settings.

### Semantics Audit
- [ ] Every custom button (GestureDetector) has a `Semantics(button: true, label: '...')` wrapper
- [ ] Every icon-only button has a semantic label
- [ ] Images have semantic descriptions where meaningful

### Contrast Check
- [ ] Text is readable against its background (especially over gradients or images)
- [ ] No text color relies solely on opacity for contrast

### Font Scaling
- [ ] UI remains usable at 1.5x system text scaling
- [ ] No text truncation at default scaling on small devices
- [ ] Touch targets are at least 44x44px

---

## Verification

After completing all phases:
```bash
flutter analyze lib/screens/<target>/
```
Must show 0 new errors. Pre-existing warnings are acceptable.
